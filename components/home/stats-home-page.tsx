"use client";

import type React from "react";

import { Book, UserCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

interface StatItemProps {
  icon: React.ReactNode;
  count: string;
  label: string;
  iconColor: string;
  delay: number;
}

const StatItem = ({ icon, count, label, iconColor, delay }: StatItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex gap-4 items-center"
    >
      <div className={`bg-white p-3 rounded-md shadow-sm ${iconColor}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <p className="text-primary text-xl md:text-2xl font-bold">{count}</p>
        <p className="text-xs md:text-sm text-muted-foreground font-medium tracking-wide">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

export default function StatsHome() {
  const stats = [
    {
      icon: <Book className="h-5 w-5  md:h-6 md:w-6" />,
      count: "10+",
      label: "TOTAL COURSES",
      iconColor: "text-emerald-500",
      delay: 0.1,
    },
    {
      icon: <UserCheck className="h-5 w-5 md:h-6 md:w-6" />,
      count: "5+",
      label: "EXPERT MENTORS",
      iconColor: "text-amber-500",
      delay: 0.2,
    },
    {
      icon: <Users className="h-5 w-5 md:h-6 md:w-6" />,
      count: "300+",
      label: "FRESHMAN STUDENTS",
      iconColor: "text-rose-500",
      delay: 0.3,
    },
  ];

  return (
    <div className=" p-4 md:p-6 lg:p-8 w-[95%] mx-auto bg-indigo-50">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            icon={stat.icon}
            count={stat.count}
            label={stat.label}
            iconColor={stat.iconColor}
            delay={stat.delay}
          />
        ))}
      </div>
    </div>
  );
}
