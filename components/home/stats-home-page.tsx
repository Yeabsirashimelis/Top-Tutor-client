"use client";

import type React from "react";

import { Book, UserCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

interface StatItemProps {
  icon: React.ReactNode;
  count: string;
  label: string;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  delay: number;
  emoji: string;
}

const StatItem = ({ icon, count, label, iconColor, gradientFrom, gradientTo, delay, emoji }: StatItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative"
    >
      <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border-2 border-white/20 hover:border-lime-400 shadow-lg hover:shadow-lime-400/20 transition-all duration-300">
        <div className="relative flex gap-4 items-center">
          <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} p-4 rounded-xl shadow-md border-2 border-white ${iconColor}`}>
            {icon}
          </div>
          <div className="flex flex-col">
            <p className="text-4xl md:text-5xl font-bold text-lime-400">
              {count}
            </p>
            <p className="text-xs md:text-sm text-white/70 font-semibold tracking-wide mt-1 uppercase">
              {label}
            </p>
          </div>
        </div>

        {/* Poker suit accent */}
        <div className="absolute top-3 right-3 text-3xl text-white/30 group-hover:text-lime-400/50 transition-colors">
          {emoji}
        </div>
      </div>
    </motion.div>
  );
};

export default function StatsHome() {
  const stats = [
    {
      icon: <Book className="h-6 w-6 md:h-7 md:w-7 text-white" />,
      count: "10+",
      label: "Total Courses",
      iconColor: "text-emerald-500",
      gradientFrom: "from-emerald-400",
      gradientTo: "to-green-500",
      delay: 0.1,
      emoji: "♠",
    },
    {
      icon: <UserCheck className="h-6 w-6 md:h-7 md:w-7 text-white" />,
      count: "5+",
      label: "Expert Mentors",
      iconColor: "text-teal-500",
      gradientFrom: "from-teal-400",
      gradientTo: "to-emerald-500",
      delay: 0.2,
      emoji: "♥",
    },
    {
      icon: <Users className="h-6 w-6 md:h-7 md:w-7 text-white" />,
      count: "300+",
      label: "Active Students",
      iconColor: "text-green-500",
      gradientFrom: "from-green-400",
      gradientTo: "to-teal-500",
      delay: 0.3,
      emoji: "♣",
    },
  ];

  return (
    <div className="relative py-16 md:py-20 w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black" />

      <div className="relative z-10 w-[95%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-white">Our</span>{" "}
            <span className="text-lime-400">Impact</span>
          </h2>
          <p className="text-white/70 text-lg">
            Join thousands of students on their learning journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              count={stat.count}
              label={stat.label}
              iconColor={stat.iconColor}
              gradientFrom={stat.gradientFrom}
              gradientTo={stat.gradientTo}
              delay={stat.delay}
              emoji={stat.emoji}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
