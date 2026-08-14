import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/password';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || '').trim().toLowerCase();
        const password = String(credentials?.password || '');
        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        const rows = await db.$queryRaw<Array<{ passwordHash: string }>>`
          SELECT "passwordHash" FROM "UserCredential" WHERE "userId" = ${user.id} LIMIT 1
        `;
        if (!rows[0] || !(await verifyPassword(password, rows[0].passwordHash))) return null;

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
  pages: { signIn: '/', error: '/' },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  jwt: { maxAge: 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};
