"use client";

import {
  ArrowUp,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-indigo-800 text-white pt-12 pb-6 px-4 md:px-8 lg:px-12">
      <div className="container mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and about section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.jpg"
                alt="TOP-TUTOR Logo"
                className="h-16 w-16 rounded-xl object-cover"
              />
              <span className="font-extrabold text-2xl tracking-tight">
                TOP-TUTOR
              </span>
            </div>
            <p className="text-indigo-100 mt-4 max-w-md">
              Empowering students with personalized learning experiences and
              expert tutoring services to achieve academic excellence.
            </p>
            <div className="flex gap-4 mt-6">
              <Link
                href="https://facebook.com"
                className="text-indigo-100 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com"
                className="text-indigo-100 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://instagram.com"
                className="text-indigo-100 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-indigo-700 pb-2">
              About Us
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-indigo-100 hover:text-white transition-colors inline-block py-1"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-indigo-100 hover:text-white transition-colors inline-block py-1"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-indigo-100 hover:text-white transition-colors inline-block py-1"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonials"
                  className="text-indigo-100 hover:text-white transition-colors inline-block py-1"
                >
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-indigo-700 pb-2">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-indigo-100 hover:text-white transition-colors inline-block py-1"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-indigo-100 hover:text-white transition-colors inline-block py-1"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-indigo-100 hover:text-white transition-colors inline-block py-1"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-indigo-100 hover:text-white transition-colors inline-block py-1"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-indigo-700 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-indigo-300 flex-shrink-0 mt-0.5" />
                <span className="text-indigo-100">
                  123 Education Street, Learning City, LC 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-300 flex-shrink-0" />
                <span className="text-indigo-100">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-300 flex-shrink-0" />
                <a
                  href="mailto:info@toptutor.com"
                  className="text-indigo-100 hover:text-white transition-colors"
                >
                  info@toptutor.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter subscription - optional */}
        <div className="border-t border-indigo-700 pt-8 pb-6 mb-6">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-3">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-indigo-100 mb-4">
              Stay updated with our latest courses and educational resources
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-md flex-1 bg-indigo-700 border border-indigo-600 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button className="bg-white text-indigo-800 hover:bg-indigo-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-indigo-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-indigo-200">
            <p>© {new Date().getFullYear()} TOP-TUTOR. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-8">
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors group"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <div className="p-1.5 rounded-full border border-indigo-600 group-hover:bg-indigo-700 transition-colors">
              <ArrowUp className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
