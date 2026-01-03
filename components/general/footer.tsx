"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Mail, 
  MapPin, 
  Phone, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "All Courses", href: "/courses" },
      { label: "Browse Subjects", href: "/subjects" },
      { label: "Become Instructor", href: "/instructor" },
      { label: "Wishlist", href: "/wishlist" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "FAQs", href: "/faqs" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-black border-t border-lime-400/20 mt-20">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-lime-400/20 blur-xl rounded-full group-hover:bg-lime-400/30 transition-all" />
                <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-lime-400 to-green-400 rounded-lg">
                  <span className="text-black font-black text-xl">♠</span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
                TopTutor
              </span>
            </Link>
            
            <p className="text-gray-400 max-w-sm">
              Transform your future with strategic learning. Play your best hand in education with expert mentors and world-class courses.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-gray-400 hover:text-lime-400 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@toptutor.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 hover:text-lime-400 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 hover:text-lime-400 transition-colors">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">123 Education St, Learning City</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-lime-400" />
              Platform
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-lime-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-lime-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-lime-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="max-w-xl">
            <h3 className="text-white font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get the latest courses, tips, and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-lime-400 transition-colors"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-400 hover:to-green-400 text-black font-medium rounded-lg transition-all shadow-lg shadow-lime-400/20">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © {currentYear} TopTutor. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-9 h-9 rounded-lg bg-zinc-900/50 hover:bg-lime-400/10 border border-zinc-700 hover:border-lime-400/50 flex items-center justify-center text-gray-400 hover:text-lime-400 transition-all"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>

            {/* Poker Suit Accent */}
            <div className="flex items-center gap-2 text-gray-600">
              {["♠", "♥", "♣", "♦"].map((suit, i) => (
                <span
                  key={i}
                  className={`text-lg ${i % 2 === 0 ? "text-lime-400/30" : "text-red-400/30"}`}
                >
                  {suit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
