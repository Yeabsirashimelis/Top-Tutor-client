"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomeTop() {
  const suits = ["♠", "♥", "♣", "♦"];
  const values = ["A", "K", "Q", "J", "10", "9"];

  return (
    <section className="relative w-full mx-auto bg-black py-16 md:py-20 lg:py-28 overflow-hidden">
      {/* Poker Table Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle floating poker cards */}
        {[...Array(8)].map((_, i) => {
          const suit = suits[Math.floor(Math.random() * suits.length)];
          const value = values[Math.floor(Math.random() * values.length)];
          return (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              <div className="bg-gray-800/40 backdrop-blur-sm p-2 rounded border border-emerald-500/20">
                <div className={suit === "♥️" || suit === "♦️" ? "text-red-400" : "text-gray-300"}>
                  {value} {suit}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Subtle green glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-green-900/20" />
      </div>

      <div className="relative z-10 w-[95%] mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content - WILD VERSION */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border-2 border-lime-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm font-semibold text-black">
                ♠ Premium Learning Platform ♠
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white">Play Your Best</span>{" "}
              <span className="text-lime-400">
                Hand
              </span>
              <br />
              <span className="text-white">In</span>{" "}
              <span className="text-lime-400">Education</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Strategic learning with expert mentors. Stack your knowledge, master your skills, and win at your career.
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
                className="group relative px-8 py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-lg transition-all duration-300 shadow-lg shadow-lime-400/20"
              >
                Browse Courses
              </Link>
              
              <Link
                href="#"
                className="px-8 py-4 bg-white hover:bg-white/90 border-2 border-white text-black font-bold rounded-lg transition-all duration-300 shadow-lg"
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
                { value: "10K+", label: "Students" },
                { value: "500+", label: "Courses" },
                { value: "98%", label: "Success Rate" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-lime-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/70">{stat.label}</div>
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

              {/* Main image container */}
              <motion.div
                className="relative z-10 bg-white/5 backdrop-blur-md rounded-3xl p-8 border-4 border-white shadow-2xl shadow-lime-400/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Poker card corner accents */}
                <div className="absolute top-4 right-4 flex flex-col items-center gap-1 text-lime-400">
                  <span className="text-3xl font-bold">A</span>
                  <span className="text-2xl">♠</span>
                </div>
                <div className="absolute bottom-4 left-4 flex flex-col items-center gap-1 text-lime-400 rotate-180">
                  <span className="text-3xl font-bold">A</span>
                  <span className="text-2xl">♠</span>
                </div>

                {/* White decorative corners */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-white rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-white rounded-br-2xl" />

                <img
                  src="/images/girl-photo.png"
                  alt="Student with thumbs up"
                  className="relative z-10 object-contain w-full h-auto"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
