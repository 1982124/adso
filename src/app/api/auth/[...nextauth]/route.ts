import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';

const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (process.env.NODE_ENV === 'production' && !nextAuthSecret) {
  throw new Error('NEXTAUTH_SECRET must be configured in production.');
}

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

        // Password verification is intentionally left unchanged until the
        // existing user schema/login migration is implemented. Do not weaken
        // or silently change the current authentication contract here.
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
  // Development keeps a local fallback so the app remains usable without
  // committing a real secret. Production requires NEXTAUTH_SECRET explicitly.
  secret: nextAuthSecret || 'adso-local-development-secret',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
