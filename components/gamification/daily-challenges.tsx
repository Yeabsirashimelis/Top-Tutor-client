"use client";

import { useState, useEffect } from "react";
import {
  useGetAllCourseChallenges,
  calculateChallengeStats,
  type NormalizedChallenge,
} from "@/hooks/daily-challenges-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  CheckCircle,
  Clock,
  BookOpen,
  Brain,
  Trophy,
  Zap,
  Sparkles,
  Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DailyChallengesProps {
  userId: string;
  courseIds?: string[];
}

// Map challenge types to icons
const challengeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  complete_lecture: BookOpen,
  pass_quiz: Brain,
  study_time: Clock,
  perfect_quiz: Trophy,
  complete_section: Target,
};

// Confetti animation component
function Confetti() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#7C3AED"][
              Math.floor(Math.random() * 4)
            ],
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{
            y: 300,
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
}

export default function DailyChallenges({
  userId,
  courseIds,
}: DailyChallengesProps) {
  const { data: challenges, isLoading, error } = useGetAllCourseChallenges(
    userId,
    courseIds
  );
  const [showCelebration, setShowCelebration] = useState(false);
  const [previousCompleted, setPreviousCompleted] = useState<number | null>(null);

  const stats = challenges ? calculateChallengeStats(challenges) : null;

  // Show celebration when all challenges are completed
  useEffect(() => {
    if (stats && previousCompleted !== null) {
      if (stats.allCompleted && previousCompleted < stats.total) {
        setShowCelebration(true);
        const timer = setTimeout(() => setShowCelebration(false), 3000);
        return () => clearTimeout(timer);
      }
    }
    if (stats) {
      setPreviousCompleted(stats.completed);
    }
  }, [stats, previousCompleted]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !challenges || challenges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Daily Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-700 mb-2">
              No Challenges Available
            </h3>
            <p className="text-sm text-gray-500">
              Enroll in courses to unlock daily challenges and earn bonus XP!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <AnimatePresence>{showCelebration && <Confetti />}</AnimatePresence>

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Daily Challenges
          </CardTitle>
          {stats && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {stats.completed}/{stats.total}
              </span>
              {stats.allCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  All Done!
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Overall Progress */}
        {stats && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Today&apos;s Progress</span>
              <span className="font-medium text-indigo-600">
                {stats.earnedPoints}/{stats.totalPoints} XP
              </span>
            </div>
            <Progress value={stats.percentage} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {challenges.map((challenge) => (
            <ChallengeItem key={challenge.id} challenge={challenge} />
          ))}
        </div>

        {/* Bonus message when all completed */}
        {stats?.allCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">
                  All Challenges Complete!
                </h4>
                <p className="text-sm text-green-600">
                  You earned {stats.earnedPoints} XP today. Come back tomorrow for new challenges!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

function ChallengeItem({ challenge }: { challenge: NormalizedChallenge }) {
  const IconComponent = challengeIcons[challenge.type] || Target;
  const progressPercentage =
    challenge.target > 0
      ? Math.min((challenge.progress / challenge.target) * 100, 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
        challenge.completed
          ? "bg-green-50 border border-green-200"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          challenge.completed
            ? "bg-green-100 text-green-600"
            : "bg-indigo-100 text-indigo-600"
        }`}
      >
        {challenge.completed ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <IconComponent className="w-5 h-5" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p
            className={`font-medium text-sm truncate ${
              challenge.completed ? "text-green-700" : "text-gray-700"
            }`}
          >
            {challenge.description}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-semibold text-yellow-600">
              +{challenge.points}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <Progress
            value={progressPercentage}
            className={`h-1.5 flex-1 ${
              challenge.completed ? "[&>div]:bg-green-500" : ""
            }`}
          />
          <span className="text-xs text-gray-500 flex-shrink-0">
            {challenge.progress}/{challenge.target}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
