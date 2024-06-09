// utils/password.ts
import bcrypt from 'bcrypt';

export async function saltAndHashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(storedPassword: string, suppliedPassword: string): Promise<boolean> {
  return await bcrypt.compare(suppliedPassword, storedPassword);
}
