/**
 * Prints a bcrypt hash for a password, to paste into ADMIN_PASSWORD_HASH.
 *
 *   npm run hash -- "my new password"
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash -- "your password"');
  process.exit(1);
}

console.log(await bcrypt.hash(password, 12));
