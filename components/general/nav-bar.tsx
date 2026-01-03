"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, BookOpen, Heart, Home } from "lucide-react";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-lg border-b border-lime-400/20 shadow-lg shadow-lime-400/10"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-lime-400/20 blur-2xl group-hover:bg-lime-400/30 transition-all duration-300" />
              <span className="relative text-3xl md:text-4xl font-black bg-gradient-to-r from-lime-400 via-green-400 to-lime-300 bg-clip-text text-transparent hover:from-lime-300 hover:via-green-300 hover:to-lime-400 transition-all duration-300 tracking-tight">
                እንማር
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? "text-lime-400"
                      : "text-gray-300 hover:text-lime-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-lime-400 to-green-400"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {session ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-lime-400/30 hover:border-lime-400/50 text-gray-300 hover:text-lime-400 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Profile</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-black transition-all font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-lg text-gray-300 hover:text-lime-400 font-medium transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-400 hover:to-green-400 text-black font-medium transition-all shadow-lg shadow-lime-400/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-zinc-900/50 border border-lime-400/30 text-lime-400"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-lg border-t border-lime-400/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-lime-400/10 text-lime-400 border border-lime-400/30"
                        : "text-gray-300 hover:bg-zinc-900/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-zinc-800 space-y-2">
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900/50 text-gray-300"
                    >
                      <User className="w-5 h-5" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-lime-500 text-black"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-lg border border-lime-400/30 text-gray-300"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-lg bg-gradient-to-r from-lime-500 to-green-500 text-black"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
