import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [],
});

