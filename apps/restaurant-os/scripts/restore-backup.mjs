import { createDecipheriv, pbkdf2Sync } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { chmodSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ephemeral = new Set(['sessions', 'auth_attempts', 'approvals', 'idempotency', 'mutation_guards']);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const identifier = name => { assert(/^[a-z_]+$/.test(name), 'Invalid database identifier.'); return '"' + name + '"'; };

export function decryptBackup(bytes, passphrase) {
  const data = Buffer.from(bytes);
  assert(data.length > 52 && data.length < 26 * 1024 * 1024, 'Invalid backup size.');
  assert(data.subarray(0, 8).toString() === 'DAWAT01\n', 'Unsupported backup format.');
  assert(typeof passphrase === 'string' && passphrase.trim().length >= 12, 'A backup passphrase is required.');
  const key = pbkdf2Sync(passphrase.trim(), data.subarray(8, 24), 600000, 32, 'sha256');
  let plaintext;
  try {
    const decipher = createDecipheriv('aes-256-gcm', key, data.subarray(24, 36));
    decipher.setAAD(Buffer.from('dawat-os-backup-v1'));
    decipher.setAuthTag(data.subarray(-16));
    plaintext = Buffer.concat([decipher.update(data.subarray(36, -16)), decipher.final()]);
  } catch { throw new Error('Backup authentication failed. The passphrase is incorrect or the file was changed.'); }
  finally { key.fill(0); }
  let backup;
  try { backup = JSON.parse(plaintext.toString('utf8')); }
  finally { plaintext.fill(0); }
  assert(backup?.format === 'dawat-os-backup' && backup.version === 1, 'Unsupported backup payload.');
  assert(backup.tables && typeof backup.tables === 'object' && !Array.isArray(backup.tables), 'Missing backup tables.');
  assert(Array.isArray(backup.blobs), 'Missing backup receipts.');
  return backup;
}

function migrations(db, directory) {
  const files = readdirSync(directory).filter(name => name.endsWith('.sql')).sort();
  assert(files.length, 'No database migrations found. Use the application revision that exported this backup.');
  for (const name of files) db.exec(readFileSync(join(directory, name), 'utf8'));
}

function validateReceipts(backup) {
  const metadata = new Map(backup.tables.attachments.map(row => [row.object_key, row]));
  assert(metadata.size === backup.tables.attachments.length, 'Duplicate receipt keys.');
  assert(backup.blobs.length === metadata.size, 'Receipt metadata and file counts differ.');
  const seen = new Set();
  return backup.blobs.map(blob => {
    assert(typeof blob.key === 'string' && /^[A-Za-z0-9_-]+\/receipts\/[A-Za-z0-9_-]+$/.test(blob.key), 'Unsafe receipt path.');
    assert(!seen.has(blob.key), 'Duplicate receipt file.'); seen.add(blob.key);
    const row = metadata.get(blob.key);
    assert(row && row.mime === blob.mime && typeof blob.base64 === 'string', 'Receipt metadata mismatch.');
    const bytes = Buffer.from(blob.base64, 'base64');
    assert(bytes.length === row.size && bytes.length <= 125000, 'Receipt size mismatch.');
    assert(bytes.toString('base64') === blob.base64, 'Invalid receipt encoding.');
    assert(['image/png', 'image/jpeg', 'application/pdf'].includes(blob.mime), 'Unknown receipt format.');
    return { ...blob, bytes };
  });
}

/** Restores only into a new directory. It never connects to or replaces a live database. */
export function restoreBackup(backup, destination, migrationDirectory = join(projectRoot, 'drizzle')) {
  const output = resolve(destination);
  assert(!existsSync(output), 'The destination already exists. Choose a new recovery directory.');
  let db;
  mkdirSync(output, { mode: 0o700 });
  try {
    const databasePath = join(output, 'restaurant.sqlite');
    writeFileSync(databasePath, '', { flag: 'wx', mode: 0o600 });
    db = new DatabaseSync(databasePath);
    db.exec('PRAGMA foreign_keys=ON');
    migrations(db, migrationDirectory);
    const tables = db.prepare("SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all().map(row => row.name);
    const expected = tables.filter(name => !ephemeral.has(name));
    assert(JSON.stringify(Object.keys(backup.tables).sort()) === JSON.stringify(expected), 'Backup schema differs from this application revision.');
    const receipts = validateReceipts(backup);
    const triggers = db.prepare("SELECT name,sql FROM sqlite_schema WHERE type='trigger'").all();
    // Restoration reconstructs an empty database. Reinstate every immutable-ledger
    // guard before this recovery database can be handed off.
    for (const trigger of triggers) db.exec('DROP TRIGGER ' + identifier(trigger.name));
    db.exec('BEGIN IMMEDIATE; PRAGMA defer_foreign_keys=ON');
    const counts = {};
    for (const table of expected) {
      const rows = backup.tables[table];
      assert(Array.isArray(rows) && rows.length <= 100000, 'Invalid table size: ' + table);
      const columns = db.prepare('PRAGMA table_info(' + identifier(table) + ')').all().map(row => row.name);
      const statement = db.prepare('INSERT INTO ' + identifier(table) + ' (' + columns.map(identifier).join(',') + ') VALUES (' + columns.map(() => '?').join(',') + ')');
      for (const row of rows) {
        assert(row && typeof row === 'object' && !Array.isArray(row), 'Invalid row in ' + table);
        assert(JSON.stringify(Object.keys(row).sort()) === JSON.stringify([...columns].sort()), 'Column mismatch in ' + table);
        const values = columns.map(column => row[column]);
        assert(values.every(value => value === null || typeof value === 'string' || Number.isSafeInteger(value)), 'Invalid value in ' + table);
        statement.run(...values);
      }
      counts[table] = rows.length;
    }
    assert(!db.prepare('PRAGMA foreign_key_check').all().length, 'Foreign key integrity check failed.');
    for (const trigger of triggers) db.exec(trigger.sql);
    // Recovery requires device pairing and a deliberate live-service cutover.
    db.exec('UPDATE terminals SET device_hash=NULL,version=version+1');
    for (const row of db.prepare('SELECT id,data_json FROM settings').all()) {
      const settings = JSON.parse(row.data_json); settings.liveBillingEnabled = false;
      db.prepare('UPDATE settings SET data_json=?,version=version+1 WHERE id=?').run(JSON.stringify(settings), row.id);
    }
    db.exec('COMMIT');
    assert(db.prepare('PRAGMA integrity_check').get().integrity_check === 'ok', 'Database integrity check failed.');
    const totals = {};
    for (const [table, column] of [['invoices', 'total_paise'], ['payments', 'amount_paise'], ['refunds', 'amount_paise'], ['stock_movements', 'quantity_milli'], ['cash_movements', 'amount_paise']]) {
      const original = backup.tables[table].reduce((sum, row) => sum + row[column], 0);
      const restored = db.prepare('SELECT COALESCE(SUM(' + identifier(column) + '),0) amount FROM ' + identifier(table)).get().amount;
      assert(original === restored, 'Ledger reconciliation failed: ' + table);
      totals[table + '.' + column] = restored;
    }
    for (const blob of receipts) {
      const path = join(output, 'receipts', blob.key);
      mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
      writeFileSync(path, blob.bytes, { mode: 0o600, flag: 'wx' });
    }
    const verification = { format: 'dawat-os-restore-verification', exportedAt: backup.exportedAt, verifiedAt: new Date().toISOString(), counts, totals, receiptFiles: receipts.length, foreignKeys: 'passed', integrity: 'ok', liveBillingEnabled: false, terminalsRequirePairing: true, sessionsRestored: 0 };
    writeFileSync(join(output, 'verification.json'), JSON.stringify(verification, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    db.close(); db = null; chmodSync(databasePath, 0o600);
    return verification;
  } catch (error) {
    if (db) { try { db.exec('ROLLBACK'); } catch { /* A transaction may not be active. */ } db.close(); }
    rmSync(output, { recursive: true, force: true });
    throw error;
  }
}

async function main() {
  const [file, destination] = process.argv.slice(2);
  assert(file && destination, 'Usage: node scripts/restore-backup.mjs BACKUP_FILE NEW_RECOVERY_DIRECTORY');
  assert(process.stdin.isTTY, 'Run this command from an interactive terminal to enter the passphrase privately.');
  const passphrase = await new Promise((resolveSecret, reject) => {
    process.stderr.write('Backup passphrase: ');
    process.stdin.setRawMode(true); process.stdin.resume(); process.stdin.setEncoding('utf8');
    let value = '';
    const finish = () => { process.stdin.setRawMode(false); process.stdin.pause(); process.stdin.off('data', onData); process.stderr.write('\n'); };
    function onData(chunk) {
      for (const char of chunk) {
        if (char === '\u0003') { finish(); reject(new Error('Cancelled.')); return; }
        if (char === '\r' || char === '\n') { finish(); resolveSecret(value); return; }
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1); else value += char;
      }
    }
    process.stdin.on('data', onData);
  });
  const result = restoreBackup(decryptBackup(readFileSync(file), passphrase), destination);
  console.log('Recovery verified:', Object.values(result.counts).reduce((a, b) => a + b, 0), 'rows;', result.receiptFiles, 'receipts.');
  console.log('Live billing is disabled. Re-pair terminals and follow the recovery guide before cutover.');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
