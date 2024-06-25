// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "../../../lib/prisma"; // Assurez-vous que votre prisma client est correctement configuré
import { getUserFromDb } from "../../../app/utils/db"; // Fonction personnalisée pour obtenir l'utilisateur de la base de données
import { signInSchema } from "../../../lib/zod"; // Schéma Zod pour la validation des données d'entrée
import { ZodError } from "zod"; // Classe d'erreur pour les erreurs de validation Zod

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
          const user = await getUserFromDb(email, password);

          if (!user) {
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
            return null;
          }
          throw error;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt', // Utiliser JWT pour gérer les sessions
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: '/signIn', // Page de connexion personnalisée
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  events: {
    async signIn(message) {
      const { user, account } = message;
      // Ajouter une entrée dans le journal des événements pour l'authentification réussie
      await prisma.eventLog.create({
        data: {
          eventType: 'signIn',
          eventData: {
            userId: user.id,
            email: user.email,
            provider: account?.provider,
          },
        },
      });
    },
    async signOut(message) {
      const { token, session } = message;
      const userId = token?.id || session?.user?.id;

      if (userId) {
        await prisma.eventLog.create({
          data: {
            eventType: 'signOut',
            eventData: {
              userId,
              email: token?.email || session?.user?.email,
            },
          },
        });
      }
    },
    async createUser(message) {
      const { user } = message;
      // Ajouter une entrée dans le journal des événements pour la création d'utilisateur
      await prisma.eventLog.create({
        data: {
          eventType: 'createUser',
          eventData: {
            userId: user.id,
            email: user.email,
          },
        },
      });
    },
    async updateUser(message) {
      const { user } = message;
      // Ajouter une entrée dans le journal des événements pour la mise à jour de l'utilisateur
      await prisma.eventLog.create({
        data: {
          eventType: 'updateUser',
          eventData: {
            userId: user.id,
            email: user.email,
          },
        },
      });
    },
    async linkAccount(message) {
      const { user, account } = message;
      // Ajouter une entrée dans le journal des événements pour le lien de compte
      await prisma.eventLog.create({
        data: {
          eventType: 'linkAccount',
          eventData: {
            userId: user.id,
            email: user.email,
            provider: account.provider,
          },
        },
      });
    },
    async session(message) {
      const { session } = message;
      // Ajouter une entrée dans le journal des événements pour la session active
      await prisma.eventLog.create({
        data: {
          eventType: 'session',
          eventData: {
            userId: session.user.id,
            email: session.user.email,
          },
        },
      });
    },
  },
});
