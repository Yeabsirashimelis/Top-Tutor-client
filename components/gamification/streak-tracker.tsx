"use client";

import { useGetGamificationProfile } from "@/hooks/gamification-hooks";
import { Flame, Calendar, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StreakTrackerProps {
  userId: string;
}

export default function StreakTracker({ userId }: StreakTrackerProps) {
  const { data, isLoading } = useGetGamificationProfile(userId);

  if (isLoading || !data?.profile) {
    return null;
  }

  const { profile } = data;
  const streakPercentage = Math.min((profile.currentStreak / 30) * 100, 100);

  // Generate calendar days (last 30 days)
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date);
  }

  const lastActivityDate = profile.lastActivityDate
    ? new Date(profile.lastActivityDate)
    : null;

  const isActiveDay = (date: Date) => {
    if (!lastActivityDate) return false;
    const diffTime = Math.abs(date.getTime() - lastActivityDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= profile.currentStreak;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Learning Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Streak Display */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{profile.currentStreak}</div>
              <div className="text-xs text-white/80">days</div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Keep learning daily to maintain your streak!
          </p>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-orange-600">{profile.currentStreak}</p>
            <p className="text-xs text-gray-600">Current Streak</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">{profile.longestStreak}</p>
            <p className="text-xs text-gray-600">Longest Streak</p>
          </div>
        </div>

        {/* Streak Milestones */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Next Milestone</span>
            <span className="text-sm text-gray-600">
              {profile.currentStreak < 7
                ? "7 days"
                : profile.currentStreak < 30
                ? "30 days"
                : profile.currentStreak < 100
                ? "100 days"
                : "Legendary!"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${streakPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Calendar View */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </h4>
          <div className="grid grid-cols-10 gap-2">
            {days.map((date, index) => {
              const isActive = isActiveDay(date);
              const isToday = date.toDateString() === today.toDateString();

              return (
                <div
                  key={index}
                  className={`
                    aspect-square rounded-md flex items-center justify-center text-xs
                    ${
                      isActive
                        ? "bg-gradient-to-br from-orange-400 to-red-500 text-white font-bold"
                        : "bg-gray-100 text-gray-400"
                    }
                    ${isToday ? "ring-2 ring-indigo-500" : ""}
                  `}
                  title={date.toDateString()}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-red-500 rounded"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-100 rounded"></div>
              <span>Inactive</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 ring-2 ring-indigo-500 rounded"></div>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Motivation Message */}
        {profile.currentStreak >= 7 && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Amazing streak! 🎉</p>
                <p className="text-sm text-green-700 mt-1">
                  {profile.currentStreak >= 30
                    ? "You're on fire! You've reached a 30-day milestone!"
                    : `Just ${7 - (profile.currentStreak % 7)} more days to your next weekly bonus!`}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
