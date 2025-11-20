'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, BookOpen, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface NavbarProps {
  variant?: 'marketing' | 'student' | 'admin'
}

export function Navbar({ variant = 'marketing' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()

  // Navigation links for marketing pages
  const navLinks =
    variant === 'marketing'
      ? [
          { label: 'Home', href: '/' },
          { label: 'Exams', href: '/exams' },
          { label: 'Features', href: '/#features' },
          { label: 'Pricing', href: '/#pricing' },
          { label: 'About', href: '/about' },
        ]
      : []

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500 text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">ExamPro</span>
          </Link>

          {/* Desktop Navigation */}
          {variant === 'marketing' && (
            <div className="hidden md:flex md:items-center md:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-500"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop Auth Buttons */}
          {variant === 'marketing' && (
            <div className="hidden md:flex md:items-center md:gap-4">
              {status === 'loading' ? (
                <Button variant="ghost" disabled>
                  Loading...
                </Button>
              ) : session?.user ? (
                <div className="flex items-center gap-4">
                  {/* User Info */}
                  <div className="hidden md:flex items-center gap-3">
                    {session.user.image && (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="text-sm">
                      <p className="font-medium">{session.user.name}</p>
                      {session.user.role && (
                        <p className="text-xs text-gray-600">{session.user.role}</p>
                      )}
                    </div>
                  </div>

                  {/* Dashboard */}
                  <Link href={session.user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                    <Button variant="outline">Dashboard</Button>
                  </Link>

                  {/* Sign Out */}
                  <Button
                    variant="ghost"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/login">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu */}
          {variant === 'marketing' && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Toggle menu" aria-expanded={isOpen}>
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Auth section in mobile */}
                  <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                    {status === 'loading' ? (
                      <Button variant="ghost" disabled>
                        Loading...
                      </Button>
                    ) : session?.user ? (
                      <>
                        <div className="flex items-center gap-3 px-2">
                          {session.user.image && (
                            <img
                              src={session.user.image}
                              alt={session.user.name || 'User'}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-medium">{session.user.name}</p>
                            {session.user.role && (
                              <p className="text-xs text-gray-600">{session.user.role}</p>
                            )}
                          </div>
                        </div>
                        <Link
                          href={session.user.role === 'admin' ? '/admin' : '/dashboard'}
                          onClick={() => setIsOpen(false)}
                        >
                          <Button variant="outline" className="w-full">
                            Dashboard
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => {
                            setIsOpen(false)
                            signOut({ callbackUrl: '/' })
                          }}
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" asChild>
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                          </Link>
                        </Button>
                        <Button asChild>
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Sign Up
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Student/Admin navbar placeholders */}
          {variant !== 'marketing' && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {variant === 'student' ? 'Student' : 'Admin'} Dashboard
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
