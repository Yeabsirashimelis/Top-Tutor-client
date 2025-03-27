"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollPosition = useRef(0);

  // Handle body scrolling without causing layout shift
  useEffect(() => {
    if (isMenuOpen) {
      // Store current scroll position
      scrollPosition.current = window.pageYOffset;

      // Add padding to the body equal to the scrollbar width
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Fix the body in place
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = "100%";
    } else {
      // Restore body to normal
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.paddingRight = "";
      document.body.style.width = "";

      // Restore scroll position
      if (scrollPosition.current > 0) {
        window.scrollTo(0, scrollPosition.current);
      }
    }

    return () => {
      // Clean up styles on unmount
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.paddingRight = "";
      document.body.style.width = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Main Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
        <div className="w-[95%] mx-auto">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                <img
                  src="/images/logo.jpg"
                  className="rounded-lg h-10 w-10 object-cover"
                  alt="TOP-TUTOR Logo"
                />
              </div>
              <span className="text-indigo-600 font-extrabold text-2xl">
                TOP-TUTOR
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-9 w-max text-base items-center justify-center rounded-md bg-background px-4 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-base">
                      Courses
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {courses.map((course) => (
                          <ListItem
                            key={course.title}
                            title={course.title}
                            href={course.href}
                          >
                            {course.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-base">
                      Mentors
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {mentors.map((mentor) => (
                          <ListItem
                            key={mentor.title}
                            title={mentor.title}
                            href={mentor.href}
                          >
                            {mentor.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/about" legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        About
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/signin">
                <Button
                  variant="ghost"
                  className="text-base text-indigo-600 font-semibold hover:bg-indigo-50"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="text-base bg-indigo-600 hover:bg-indigo-700">
                  Register
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="flex md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6 text-indigo-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Using Portal approach */}
      {isMenuOpen && (
        <div className="md:hidden">
          {/* Full screen overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
            style={{ position: "fixed" }}
          />

          {/* Menu content */}
          <div
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl z-50 flex flex-col"
            style={{ position: "fixed" }}
          >
            {/* Menu header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="text-lg font-bold text-indigo-600">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Menu items */}
            <div className="flex-1 overflow-y-auto">
              <nav className="flex flex-col p-4">
                <Link
                  href="/"
                  className="flex items-center py-3 px-4 text-base font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>

                {/* Courses Section */}
                <div className="mt-2 mb-2">
                  <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Courses
                  </h3>
                  <div className="space-y-1">
                    {courses.map((course) => (
                      <Link
                        key={course.title}
                        href={course.href}
                        className="flex items-center py-3 px-4 pl-8 text-base font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {course.title}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mentors Section */}
                <div className="mt-2 mb-2">
                  <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Mentors
                  </h3>
                  <div className="space-y-1">
                    {mentors.map((mentor) => (
                      <Link
                        key={mentor.title}
                        href={mentor.href}
                        className="flex items-center py-3 px-4 pl-8 text-base font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {mentor.title}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/about"
                  className="flex items-center py-3 px-4 text-base font-medium text-gray-900 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </nav>
            </div>

            {/* Auth buttons */}
            <div className="p-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const ListItem = ({ className, title, children, href, ...props }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

const courses = [
  {
    title: "Freshman Mathematics",
    href: "/courses/freshman-mathematics",
    description: "learn freshman mathematics and conquer your examinations.",
  },
  {
    title: "Freshman physics",
    href: "/courses/freshman-physics",
    description:
      "Master broad concepts in physics and help yourself to get the field you want.",
  },
  {
    title: "Logic and Critical thinking",
    href: "/courses/logic-critical-thinking",
    description:
      "think critically and logically after finishing the course and conquer the exam.",
  },
  {
    title: "Freshman Psycology",
    href: "/courses/freshman-psycology",
    description:
      "apart from examination, learn and undestand the human pyscology",
  },
];

const mentors = [
  {
    title: "Find a Mentor",
    href: "/mentors/find",
    description:
      "Browse our network of experienced professionals ready to guide you",
  },
  {
    title: "Become a Mentor",
    href: "/mentors/become",
    description: "Share your knowledge and help others grow in their careers",
  },
  {
    title: "Mentorship Programs",
    href: "/mentors/programs",
    description:
      "Structured programs designed to accelerate your learning journey",
  },
  {
    title: "Success Stories",
    href: "/mentors/success-stories",
    description: "Read about how mentorship has transformed careers",
  },
];
