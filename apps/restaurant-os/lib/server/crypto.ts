import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';

// Workers can cap native PBKDF2 iterations. Keep the full work factor with
// the maintained implementation, and verify compatibility against node:crypto.
export function derivePasswordKey(password: string, salt: Uint8Array) {
  return pbkdf2Async(sha256, new TextEncoder().encode(password), salt, {
    c: 600000,
    dkLen: 32,
    asyncTick: 10,
  });
}
