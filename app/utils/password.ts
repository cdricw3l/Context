// utils/password.ts
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

export function saltAndHashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hashedPassword}`;
}

export function verifyPassword(storedPassword: string, suppliedPassword: string): boolean {
  const [salt, key] = storedPassword.split(':');
  const hashedBuffer = Buffer.from(key, 'hex');
  const suppliedBuffer = scryptSync(suppliedPassword, salt, 64);
  
  return timingSafeEqual(hashedBuffer, suppliedBuffer);
}
