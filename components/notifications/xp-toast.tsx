"use client";

import { useEffect, useState } from "react";
import { Zap, TrendingUp, Star, Award } from "lucide-react";
import { motion } from "framer-motion";

interface XPToastProps {
  points: number;
  description: string;
  type?: "xp" | "level" | "streak" | "badge";
}

export default function XPToast({
  points,
  description,
  type = "xp",
}: XPToastProps) {
  const [displayPoints, setDisplayPoints] = useState(0);

  // Animate the points counting up
  useEffect(() => {
    const duration = 600; // ms
    const steps = 20;
    const increment = points / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), points);
      setDisplayPoints(current);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayPoints(points);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [points]);

  const getIcon = () => {
    switch (type) {
      case "level":
        return <TrendingUp className="w-5 h-5 text-white" />;
      case "streak":
        return <Star className="w-5 h-5 text-white" />;
      case "badge":
        return <Award className="w-5 h-5 text-white" />;
      default:
        return <Zap className="w-5 h-5 text-white" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "level":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "streak":
        return "bg-gradient-to-r from-orange-500 to-red-500";
      case "badge":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      default:
        return "bg-gradient-to-r from-yellow-500 to-amber-500";
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case "level":
        return "text-green-600 border-green-500";
      case "streak":
        return "text-orange-600 border-orange-500";
      case "badge":
        return "text-purple-600 border-purple-500";
      default:
        return "text-yellow-600 border-yellow-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`flex items-center gap-3 bg-white rounded-lg shadow-lg p-4 border-l-4 ${getAccentColor()}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={`${getBgColor()} p-2.5 rounded-full shadow-md`}
      >
        {getIcon()}
      </motion.div>
      <div className="flex-1">
        <motion.p
          className={`font-bold text-lg ${getAccentColor().split(" ")[0]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          +{displayPoints} XP
        </motion.p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-2xl"
      >
        ✨
      </motion.div>
    </motion.div>
  );
}

export function LevelUpToast({ newLevel }: { newLevel: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      className="flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-2xl p-5"
    >
      <motion.div
        animate={{
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 0.5,
          repeat: 2,
        }}
        className="bg-white/20 p-3 rounded-full"
      >
        <TrendingUp className="w-7 h-7 text-white" />
      </motion.div>
      <div className="flex-1">
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="font-bold text-white text-xl"
        >
          Level Up!
        </motion.p>
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-indigo-100"
        >
          You reached Level {newLevel}
        </motion.p>
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        className="bg-white/20 rounded-full w-14 h-14 flex items-center justify-center"
      >
        <span className="text-3xl font-bold text-white">{newLevel}</span>
      </motion.div>
    </motion.div>
  );
}
