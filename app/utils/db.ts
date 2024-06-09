import { PrismaClient } from '@prisma/client';
import { verifyPassword, saltAndHashPassword } from './password';

const prisma = new PrismaClient();

export async function getUserFromDb(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && verifyPassword(user.password, password)) {
    return {
      ...user,
      id: user.id.toString(), // Assurez-vous que l'id est une chaîne
    };
  }

  return null;
}

export async function createUser(email: string, password: string) {
  const hashedPassword = saltAndHashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return user;
}
