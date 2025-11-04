import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      // Check if user is blocked
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      })

      if (existingUser?.isBlocked) {
        return false
      }

      // Update last login
      if (existingUser) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { lastLoginAt: new Date() },
        })
      }

      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        
        // Add role to session
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, isBlocked: true },
        })

        session.user.role = dbUser?.role || 'student'
        session.user.isBlocked = dbUser?.isBlocked || false
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // After sign in, redirect based on role
      if (url.startsWith('/')) return url
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}