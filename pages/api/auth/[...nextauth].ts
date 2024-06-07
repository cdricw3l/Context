import NextAuth, { NextAuthOptions, User, Account, Profile, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { JWT } from 'next-auth/jwt';

const prisma = new PrismaClient();

const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '../../sign/signIn',
    error: '../../sign/signIn',  // Rediriger vers la page de connexion personnalisée en cas d'erreur
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }: { token: JWT, user?: User, account?: Account | null, profile?: Profile, isNewUser?: boolean }) {
      if (account) {
        console.log('Account:', account);  // Ajoutez cette ligne pour déboguer l'objet account
        if (account.access_token) {
          token.accessToken = account.access_token;
        }
        if (account.id) {
          token.id = String(account.id);
        }
      }
      console.log('JWT Callback:', { token, user, account, profile, isNewUser });
      return token;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      console.log('Session Callback:', { session, token });
      if (token && typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
      console.log('Redirect Callback:', { url, baseUrl });
      if (url === '/profile') {
        return baseUrl;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};

export default NextAuth(options);
