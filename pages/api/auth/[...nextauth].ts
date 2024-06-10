// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserFromDb } from "../../../app/utils/db";
import { signInSchema } from "../../../lib/zod";
import { ZodError } from "zod";

export default NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);
          console.log('Email:', email); // Debug
          console.log('Password:', password); // Debug
          const user = await getUserFromDb(email, password);

          if (!user) {
            console.error("User not found.");
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation error:", error.errors);
            return null;
          }
          console.error("Error in authorize:", error);
          throw error;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: '/signIn',
  },
});
