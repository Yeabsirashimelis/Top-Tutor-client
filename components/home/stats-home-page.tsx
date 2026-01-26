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
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative"
    >
      <div className="relative bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative flex gap-4 items-center">
          <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} p-4 rounded-xl shadow-sm ${iconColor}`}>
            {icon}
          </div>
          <div className="flex flex-col">
            <p className="text-4xl md:text-5xl font-bold text-gray-900">
              {count}
            </p>
            <p className="text-xs md:text-sm text-gray-600 font-semibold tracking-wide mt-1 uppercase">
              {label}
            </p>
          </div>
        </div>

        {/* Icon accent */}
        <div className="absolute top-3 right-3 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
          {emoji}
        </div>
      </div>
    </motion.div>
  );
};

export default function StatsHome() {
  const stats = [
    {
      icon: <Book className="h-6 w-6 md:h-7 md:w-7 text-blue-600" />,
      count: "10+",
      label: "Total Courses",
      iconColor: "text-blue-600",
      gradientFrom: "from-blue-50",
      gradientTo: "to-blue-100",
      delay: 0.1,
      emoji: "📚",
    },
    {
      icon: <UserCheck className="h-6 w-6 md:h-7 md:w-7 text-indigo-600" />,
      count: "5+",
      label: "Expert Mentors",
      iconColor: "text-indigo-600",
      gradientFrom: "from-indigo-50",
      gradientTo: "to-indigo-100",
      delay: 0.2,
      emoji: "👨‍🏫",
    },
    {
      icon: <Users className="h-6 w-6 md:h-7 md:w-7 text-purple-600" />,
      count: "300+",
      label: "Active Students",
      iconColor: "text-purple-600",
      gradientFrom: "from-purple-50",
      gradientTo: "to-purple-100",
      delay: 0.3,
      emoji: "🎓",
    },
  ];

  return (
    <div className="relative py-16 md:py-20 w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />

      <div className="relative z-10 w-[95%] max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-gray-900">Our</span>{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Impact</span>
          </h2>
          <p className="text-gray-600 text-lg">
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
