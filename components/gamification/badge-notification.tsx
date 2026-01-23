"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Award, X, Sparkles, Star, Trophy, Flame, Zap, Target, Brain, Heart } from "lucide-react";
import { RARITY_GRADIENTS, RARITY_BORDERS, RARITY_BG_COLORS, type BadgeRarity } from "@/types/gamification";
import type { NotificationBadge } from "@/hooks/use-badge-notification";

interface BadgeNotificationProps {
  badges: NotificationBadge[];
  onClose: () => void;
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  star: Star,
  trophy: Trophy,
  flame: Flame,
  zap: Zap,
  target: Target,
  brain: Brain,
  heart: Heart,
  award: Award,
};

const getBadgeIcon = (iconName: string) => {
  // Check if it's an emoji (starts with a common emoji Unicode range)
  if (/^\p{Emoji}/u.test(iconName)) {
    return null; // Return null to indicate emoji mode
  }
  return iconMap[iconName.toLowerCase()] || Award;
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
  const rarity = (badge.rarity || "common") as BadgeRarity;
  const IconComponent = getBadgeIcon(badge.icon);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.8 }}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <Card
          className={`border-4 ${RARITY_BORDERS[rarity]} shadow-2xl overflow-hidden`}
        >
          <div
            className={`h-2 bg-gradient-to-r ${RARITY_GRADIENTS[rarity]}`}
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
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${RARITY_GRADIENTS[rarity]} flex items-center justify-center shadow-lg`}
                >
                  {IconComponent ? (
                    <IconComponent className="w-10 h-10 text-white" />
                  ) : (
                    <span className="text-4xl">{badge.icon}</span>
                  )}
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
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${RARITY_GRADIENTS[rarity]} opacity-30`}
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
                    className={`text-xs px-2 py-1 rounded-full font-semibold uppercase ${RARITY_BG_COLORS[rarity]}`}
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
