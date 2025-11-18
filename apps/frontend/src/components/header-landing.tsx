import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { NAVBAR_LINKS } from './constants'

interface NavbarProps {
  isLoggedIn?: boolean
}

export default function Navbar({ isLoggedIn = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'top-2' : 'top-0'
      }`}
    >
      <div
        className={`mx-auto transition-all duration-300 ${
          isScrolled
            ? 'max-w-6xl px-4 sm:px-6 lg:px-8 bg-card/70 backdrop-blur-xl border border-border rounded-2xl shadow-lg'
            : 'max-w-7xl px-4 sm:px-6 lg:px-8 bg-transparent'
        }`}
      >
        <div
          className={`flex justify-between items-center transition-all duration-300 ${
            isScrolled ? 'h-14' : 'h-16'
          }`}
        >
          <Link
            to="/"
            className="flex items-center space-x-2 hover:scale-105 active:scale-95 transition-transform duration-150"
          >
            <svg
              className="w-8 h-8 text-foreground"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M10 10h8v20h-8z"
                fill="currentColor"
              />
              <path
                d="M22 10h8v8h-8z"
                fill="currentColor"
              />
              <path
                d="M22 22l8 8h-8v-8z"
                fill="currentColor"
              />
            </svg>
            <span className="text-xl font-bold text-foreground">N7N</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {NAVBAR_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="px-6 py-2 rounded-full font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/signin"
                  className="text-muted-foreground hover:text-foreground transition-transform transform hover:scale-105 active:scale-95"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-6 py-2 rounded-full font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-transform transform hover:scale-105 active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-foreground focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-card border-t border-border`}
      >
        <div className="px-4 py-4 space-y-4">
          {NAVBAR_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 space-y-2">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="block px-6 py-2 bg-primary text-primary-foreground rounded-full text-center font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/signin"
                  className="block px-6 py-2 text-center text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  className="block px-6 py-2 text-primary-foreground bg-primary rounded-full text-center font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
