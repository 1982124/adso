import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/password';

const nextAuthSecret = process.env.NEXTAUTH_SECRET?.trim();
if (!nextAuthSecret || nextAuthSecret.length < 32) {
  throw new Error('NEXTAUTH_SECRET must be configured with at least 32 characters');
}

const BOOTSTRAP_ADMIN_EMAIL = 'neodigitalstartupacademy@gmail.com';

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

        const userCount = await db.user.count();

        // One-time first-admin bootstrap: only the designated ADSO admin email
        // can create the very first account, and the password is hashed before storage.
        if (userCount === 0 && email === BOOTSTRAP_ADMIN_EMAIL) {
          const passwordHash = await hashPassword(password);
          const user = await db.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
              data: {
                email,
                name: 'ADSO Direction',
                role: 'admin',
                country: 'ML',
                language: 'fr',
                subscription: 'free',
                emailVerified: new Date(),
              },
              select: { id: true, email: true, name: true, role: true, avatar: true, image: true },
            });

            await tx.$executeRaw`
              INSERT INTO "UserCredential" ("id", "userId", "passwordHash")
              VALUES (${crypto.randomUUID()}, ${createdUser.id}, ${passwordHash})
            `;

            return createdUser;
          });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.avatar || user.image,
          };
        }

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !['admin', 'super_admin'].includes(user.role)) return null;

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
  secret: nextAuthSecret,
};
