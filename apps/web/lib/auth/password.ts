import { randomBytes, scryptSync } from 'crypto';

// Pass the password string and get hashed password back
// ( and store only the hashed string in your database)
function encryptPassword(password: string, salt: string) {
  return scryptSync(password, salt, 32).toString('hex');
}

/**
 * Hash password with random salt
 * @return {string} password hash followed by salt
 *  XXXX till 64 XXXX till 32
 *
 */
export function hashPassword(password: string) {
  // Any random string here (ideally should be at least 16 bytes)
  const salt = randomBytes(16).toString('hex');
  return encryptPassword(password, salt) + salt;
}

/**
 * Match password against the stored hash
 */
export function verifyPasswordHash(hash: string, password: string) {
  // extract salt from the hashed string
  // our hex password length is 32*2 = 64
  const salt = hash.slice(64);
  const originalPassHash = hash.slice(0, 64);
  const currentPassHash = encryptPassword(password, salt);
  return originalPassHash === currentPassHash;
}
