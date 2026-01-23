"use client";

import { useGetGamificationProfile } from "@/hooks/gamification-hooks";
import {
  Trophy,
  Zap,
  Target,
  Award,
  TrendingUp,
  Star,
  Flame,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { PointTransaction } from "@/types/gamification";

interface GamificationDashboardProps {
  userId: string;
}

// Skeleton loader for cards
function StatCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-10 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-2 bg-gray-200 rounded" />
      </CardContent>
    </Card>
  );
}

export default function GamificationDashboard({
  userId,
}: GamificationDashboardProps) {
  const { data, isLoading } = useGetGamificationProfile(userId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Hero Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        {/* Progress Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.profile) {
    return null;
  }

  const { profile, recentTransactions } = data;
  const levelProgress =
    (profile.currentLevelPoints / profile.pointsToNextLevel) * 100;

  // Format transaction type for display
  const formatTransactionType = (transaction: PointTransaction) => {
    if (transaction.description) return transaction.description;
    return transaction.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get icon for transaction type
  const getTransactionIcon = (type: string) => {
    if (type.includes("lecture")) return BookOpen;
    if (type.includes("quiz")) return CheckCircle;
    if (type.includes("course")) return Trophy;
    if (type.includes("streak")) return Flame;
    if (type.includes("badge")) return Award;
    return Zap;
  };

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level Card with Progress */}
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{profile.level}</div>
            <Progress value={levelProgress} className="h-2 bg-white/20" />
            <p className="text-xs mt-2 text-indigo-100">
              {profile.currentLevelPoints.toLocaleString()} /{" "}
              {profile.pointsToNextLevel.toLocaleString()} XP to next level
            </p>
          </CardContent>
        </Card>

        {/* Total Points */}
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              {profile.totalPoints.toLocaleString()}
            </div>
            <p className="text-xs text-amber-100">Lifetime earnings</p>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{profile.currentStreak}</div>
            <p className="text-xs text-red-100">
              days · Best: {profile.longestStreak}
            </p>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              {profile.badges?.length || 0}
            </div>
            <p className="text-xs text-green-100">Achievements unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600" />
              Lectures Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">
              {profile.totalLecturesCompleted || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-600" />
              Quizzes Passed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {profile.totalQuizzesPassed || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-green-600" />
              Courses Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {profile.totalCoursesCompleted || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Only show if there are transactions */}
      {recentTransactions && recentTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((transaction) => {
                const IconComponent = getTransactionIcon(transaction.type);
                return (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {formatTransactionType(transaction)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        +{transaction.points}
                      </p>
                      <p className="text-xs text-gray-500">XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
