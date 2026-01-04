"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Award, X, Sparkles } from "lucide-react";

interface Badge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  points: number;
}

interface BadgeNotificationProps {
  badges: Badge[];
  onClose: () => void;
}

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-yellow-600",
};

const rarityBorders = {
  common: "border-gray-400",
  rare: "border-blue-400",
  epic: "border-purple-400",
  legendary: "border-yellow-400",
};

export default function BadgeNotification({
  badges,
  onClose,
}: BadgeNotificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (badges.length === 0) return;

    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      if (currentIndex < badges.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, badges.length, onClose]);

  if (badges.length === 0 || !isVisible) return null;

  const badge = badges[currentIndex];
  const rarity = badge.rarity as keyof typeof rarityColors;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.8 }}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <Card
          className={`border-4 ${rarityBorders[rarity]} shadow-2xl overflow-hidden`}
        >
          <div
            className={`h-2 bg-gradient-to-r ${rarityColors[rarity]}`}
          ></div>
          <CardContent className="pt-6 pb-4">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="flex items-center gap-4">
              {/* Badge Icon */}
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${rarityColors[rarity]} flex items-center justify-center text-4xl shadow-lg`}
                >
                  {badge.icon}
                </motion.div>
                <motion.div
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${rarityColors[rarity]} opacity-30`}
                ></motion.div>
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-lg text-gray-900">
                    Badge Unlocked!
                  </h3>
                </div>
                <h4 className="font-bold text-xl text-indigo-600 mb-1">
                  {badge.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {badge.description}
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold uppercase ${
                      rarity === "common"
                        ? "bg-gray-100 text-gray-700"
                        : rarity === "rare"
                        ? "bg-blue-100 text-blue-700"
                        : rarity === "epic"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {badge.rarity}
                  </span>
                  {badge.points > 0 && (
                    <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      +{badge.points} XP
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Multiple badges indicator */}
            {badges.length > 1 && (
              <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-center gap-2">
                {badges.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-indigo-600 w-6"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
