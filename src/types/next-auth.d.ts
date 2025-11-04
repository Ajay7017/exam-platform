import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string
      isBlocked: boolean
    }
  }

  interface User {
    role: string
    isBlocked: boolean
  }
}