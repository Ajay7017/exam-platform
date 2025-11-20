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
    async jwt({ token, user, account, profile, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role || 'student'
        token.isBlocked = user.isBlocked || false
      }
      
      // Fetch latest user data on each request
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, isBlocked: true },
        })
        
        if (dbUser) {
          token.role = dbUser.role
          token.isBlocked = dbUser.isBlocked
        }
      }
      
      return token
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.isBlocked = token.isBlocked as boolean
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // If the URL is a relative path, use it
      if (url.startsWith('/')) return `${baseUrl}${url}`
      
      // If the URL's origin matches the base URL, use it
      else if (new URL(url).origin === baseUrl) return url
      
      // Otherwise redirect to dashboard
      return `${baseUrl}/dashboard`
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt', // Changed from 'database' to 'jwt'
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}