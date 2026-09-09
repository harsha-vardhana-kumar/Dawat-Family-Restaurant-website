# Encrypted backup and recovery

## Export

Only an Owner can export a backup from Settings → Backup & recovery. Use a unique passphrase of at least 12 characters, retained separately from the file. The export contains restaurant data, credential hashes, and stored receipt files. Treat both the encrypted export and any recovered data as confidential.

The format is `DAWAT01\n` followed by a 16-byte salt, a 12-byte nonce and AES-256-GCM ciphertext with its authentication tag. PBKDF2-SHA-256 uses 600,000 iterations and the salt to derive the key; the format identifier is authenticated as additional data. There is no passphrase recovery mechanism.

Database tables are read in one D1 batch snapshot. Receipt files are read from the attachment keys in that snapshot. Sessions, authentication attempt counters, temporary manager approvals, idempotency records and mutation guards are excluded. An export fails when any referenced receipt is missing or the size limit is exceeded; it does not silently omit records.

Application exports are bounded to 100,000 rows per table, fewer than 12 MiB of receipt bytes and fewer than 25 MiB of plaintext. This is an owner-operated export, not an installed daily backup schedule. Plan provider-managed D1 and R2 backups as the data grows, and monitor their actual retention and recovery capabilities.

## Restore into an isolated directory

Use Node.js 22.13 or newer and the same application revision/migrations used to create the export. Run from the application directory:

```sh
node scripts/restore-backup.mjs /secure/path/backup.dawat /secure/path/new-recovery-directory
```

The command asks for the passphrase through a hidden terminal prompt. Do not put the passphrase in a command argument, environment file, issue, log or chat. The destination must not exist. A wrong passphrase or changed ciphertext is rejected before restoration writes begin.

Successful output contains:

| File | Purpose |
| --- | --- |
| `restaurant.sqlite` | Restored database with foreign keys and immutable-ledger triggers reinstated |
| `receipts/<original-object-key>` | Every receipt at its original logical storage key |
| `verification.json` | Row counts, invoice/payment/refund/stock/cash totals, receipt count and integrity results |

The script validates exact tables and columns, safe integers, receipt paths/MIME/encoding/sizes, foreign keys and SQLite integrity. It reconciles the five financial/stock ledger totals against the authenticated payload. Files use restrictive local permissions. It refuses existing output paths. If reconstruction fails, it removes only the newly created recovery directory.

Restoration clears terminal pairing credentials, restores no sessions, and sets live billing to **false**. Recovered staff credential hashes and platform identities are preserved. The `Redeem cancelled` loyalty event releases a cancelled unpaid invoice's redemption without creating a new credit or extending the original points' expiry.

## Hosted cutover

The script does **not** overwrite a live D1 database or upload objects to R2. A deployment operator must rehearse the following against a separate empty environment before any incident:

1. Preserve the current deployment and provider backup. Stop writes for the actual cutover and reconcile any orders/payments entered after the chosen export time. Restoring an old export cannot recover later transactions.
2. Restore locally and inspect `verification.json`. Compare invoice counts, issued-number ranges, collections, refunds, outstanding bills, supplier balances and stock against the chosen recovery point.
3. Use the hosting provider's supported import process to transfer the verified database to a **new** D1 instance, preserving table data, constraints, triggers and migration history. If that process requires SQL instead of SQLite, produce and validate its import format in the rehearsal; do not strip integrity triggers from a live database.
4. Upload each recovered receipt to a new R2 bucket using the exact original object key and MIME type. Verify counts, sizes and receipt download access through the application.
5. Bind the recovered D1 and R2 resources to the matching application revision. Do not apply the initial migrations a second time to already restored tables. Keep the original deployment available for rollback until reconciliation is accepted.
6. Sign in, re-pair terminals, rotate credentials as appropriate, check invoice sequencing and reports, print a receipt, and run the acceptance workflow. Enable live billing only after the owner approves the reconciled cutover.

The automated test has completed a local round trip with financial records and a receipt, including wrong-passphrase, tampering and overwrite refusal. **A provider D1/R2 restore and production cutover have not been rehearsed in this session.** That is an explicit launch gate, not a claimed completed integration. No automatic remote restore or disaster-recovery SLA is configured.
