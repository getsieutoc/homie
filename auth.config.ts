import { prisma, PrismaClient } from '@/lib/prisma-client';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthConfig } from 'next-auth';

const authConfig = {
  secret: process.env.AUTH_SECRET!,

  adapter: PrismaAdapter(prisma as PrismaClient),

  // We do this to avoid bringing bcrypt into the middleware
  providers: [],

  pages: {
    signIn: '/auth',
    verifyRequest: '/auth',
    error: '/auth' // Error code passed in query string as ?error=
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
