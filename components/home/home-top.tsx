"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, TrendingUp } from "lucide-react";

export default function HomeTop() {
  return (
    <section className="relative w-full mx-auto bg-gradient-to-b from-gray-50 to-white py-16 md:py-20 lg:py-28 overflow-hidden">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
      </div>

      <div className="relative z-10 w-[95%] max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full shadow-sm border border-blue-200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">
                Premium Learning Platform
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-gray-900">Learn Anything,</span>{" "}
              <br />
              <span className="text-gray-900">Achieve</span>{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Everything
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Unlock your potential with expert-led courses. Master new skills, advance your career, and achieve your educational goals.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/courses"
                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Browse Courses
              </Link>
              
              <Link
                href="#"
                className="px-8 py-4 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Start Free Trial
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap gap-8 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { value: "10K+", label: "Students", icon: Users },
                { value: "500+", label: "Courses", icon: BookOpen },
                { value: "98%", label: "Success Rate", icon: TrendingUp },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Hero Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Decorative background elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30" />
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-30" />

              {/* Main image container */}
              <motion.div
                className="relative z-10 bg-white rounded-3xl p-8 border border-gray-200 shadow-xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/girl-photo.png"
                  alt="Student learning online"
                  className="relative z-10 object-contain w-full h-auto rounded-2xl"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
