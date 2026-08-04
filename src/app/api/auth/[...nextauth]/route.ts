import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  // ─── Providers ──────────────────────────────────────────
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Look up user by email
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        // In demo/beta: any password is accepted for existing users
        // TODO: In production, verify password hash
        // For now, we do a basic check — empty password = reject
        if (!credentials.password) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.avatar || user.image,
        };
      },
    }),
  ],

  // ─── Session & JWT Callbacks ─────────────────────────────
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as Record<string, unknown>).role as string || 'student';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as Record<string, unknown>).id = token.id;
        (session.user as unknown as Record<string, unknown>).role = token.role;
      }
      return session;
    },
  },

  // ─── Pages ──────────────────────────────────────────────
  pages: {
    signIn: '/',       // SPA — login handled in-page
    error: '/',        // SPA — errors shown in-page
  },

  // ─── Session Config ─────────────────────────────────────
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  // ─── JWT Config ─────────────────────────────────────────
  jwt: {
    maxAge: 24 * 60 * 60,
  },

  // ─── Security ────────────────────────────────────────────
  secret: process.env.NEXTAUTH_SECRET || 'adso-dev-secret-change-in-production',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
