"use client";

import { useGetGamificationProfile } from "@/hooks/gamification-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Flame, Calendar, Shield, CheckCircle, Award } from "lucide-react";

interface StreakTrackerProps {
  userId: string;
}

export default function StreakTracker({ userId }: StreakTrackerProps) {
  const { data, isLoading } = useGetGamificationProfile(userId);

  // Generate last 30 days for calendar view
  const generateDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date,
        dayOfWeek: date.getDay(),
        dayOfMonth: date.getDate(),
        isToday: i === 0,
      });
    }
    return days;
  };

  const days = generateDays();

  // Determine if a day was active based on streak data
  const isActiveDay = (date: Date) => {
    if (!data?.profile) return false;

    const { currentStreak, lastActivityDate } = data.profile;

    if (!lastActivityDate || currentStreak === 0) return false;

    const lastActive = new Date(lastActivityDate);
    lastActive.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate days since last activity
    const daysSinceLastActivity = Math.floor(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If last activity was more than 1 day ago, streak is broken
    if (daysSinceLastActivity > 1) return false;

    // Calculate streak start date
    const streakStartDate = new Date(lastActive);
    streakStartDate.setDate(streakStartDate.getDate() - currentStreak + 1);

    // Check if the date falls within the streak period
    return checkDate >= streakStartDate && checkDate <= lastActive;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data?.profile) return null;

  const { profile } = data;
  const streakFreezeAvailable = profile.streakFreezeAvailable ?? false;

  // Calculate next milestone
  const getNextMilestone = () => {
    if (profile.currentStreak < 7) return { target: 7, remaining: 7 - profile.currentStreak };
    if (profile.currentStreak < 30) return { target: 30, remaining: 30 - profile.currentStreak };
    if (profile.currentStreak < 100) return { target: 100, remaining: 100 - profile.currentStreak };
    return { target: 365, remaining: 365 - profile.currentStreak };
  };

  const milestone = getNextMilestone();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Daily Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Streak Display */}
        <div className="flex justify-center">
          <div
            className={`relative w-32 h-32 rounded-full flex items-center justify-center ${
              profile.currentStreak > 0
                ? "bg-gradient-to-br from-orange-400 to-red-500"
                : "bg-gray-200"
            }`}
          >
            {/* Animated ring for active streak */}
            {profile.currentStreak > 0 && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-red-500 animate-pulse opacity-50" />
            )}
            <div className="relative text-center">
              <div
                className={`text-4xl font-bold ${
                  profile.currentStreak > 0 ? "text-white" : "text-gray-500"
                }`}
              >
                {profile.currentStreak}
              </div>
              <div
                className={`text-sm ${
                  profile.currentStreak > 0 ? "text-orange-100" : "text-gray-400"
                }`}
              >
                {profile.currentStreak === 1 ? "day" : "days"}
              </div>
            </div>
          </div>
        </div>

        {/* Streak Freeze Indicator */}
        {streakFreezeAvailable && (
          <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-lg">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">
              Streak Freeze Available
            </span>
          </div>
        )}

        {/* Best Streak & Next Milestone */}
        <div className="flex justify-between text-center">
          <div>
            <p className="text-xs text-gray-500">Longest</p>
            <p className="text-lg font-bold text-gray-700">
              {profile.longestStreak} days
            </p>
          </div>
          <div className="h-full w-px bg-gray-200" />
          <div>
            <p className="text-xs text-gray-500">Next Milestone</p>
            <p className="text-lg font-bold text-gray-700">
              {milestone.remaining} to go
            </p>
          </div>
        </div>

        {/* Calendar View */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Last 30 Days
            </span>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div
                key={i}
                className="text-center text-xs text-gray-400 font-medium"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Add empty cells for alignment */}
            {[...Array(days[0].dayOfWeek)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {days.map((day, index) => {
              const isActive = isActiveDay(day.date);
              return (
                <div
                  key={index}
                  className={`
                    aspect-square rounded flex items-center justify-center text-xs font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-sm"
                        : day.isToday
                        ? "bg-indigo-100 text-indigo-600 ring-2 ring-indigo-300"
                        : "bg-gray-100 text-gray-500"
                    }
                  `}
                  title={day.date.toLocaleDateString()}
                >
                  {isActive ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    day.dayOfMonth
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-red-500 rounded" />
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-indigo-100 ring-2 ring-indigo-300 rounded" />
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Motivation Message */}
        {profile.currentStreak >= 7 && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Award className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">
                {profile.currentStreak >= 30
                  ? "You're on fire! Amazing 30+ day streak!"
                  : `Great job! ${30 - profile.currentStreak} more days to a month streak!`}
              </p>
            </div>
          </div>
        )}

        {/* Encouragement for new users */}
        {profile.currentStreak === 0 && (
          <p className="text-center text-sm text-gray-500">
            Start learning today to begin your streak!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
