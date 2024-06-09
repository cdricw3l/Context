import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserFromDb } from "../../../app/utils/db";
import { signInSchema } from "../../../lib/zod";
import { ZodError } from "zod";
// Your own logic for dealing with plaintext password strings; be careful!
import { saltAndHashPassword } from "../../../app/utils/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);

          const pwHash = saltAndHashPassword(password);
          const user = await getUserFromDb(email, pwHash);

          if (!user) {
            throw new Error("User not found.");
          }

          return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          throw error;
        }
      },
    }),
  ],
});