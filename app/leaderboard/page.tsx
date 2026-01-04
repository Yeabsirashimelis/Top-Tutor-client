"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useGetLeaderboard } from "@/hooks/leaderboard-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Flame,
  Zap,
  Crown,
  Star,
} from "lucide-react";

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [timeframe, setTimeframe] = useState<string>("all-time");
  const { data, isLoading, error } = useGetLeaderboard(50, timeframe);

  console.log("🏆 [LEADERBOARD PAGE]", { isLoading, hasData: !!data, dataLength: data?.leaderboard?.length, error });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
          </div>
          <p className="text-gray-600 text-lg">
            See how you rank against other learners
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            {["all-time", "monthly", "weekly"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-6 py-2 rounded-md font-medium transition ${
                  timeframe === tf
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tf === "all-time"
                  ? "All Time"
                  : tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Leaderboard */}
        {!isLoading && data?.leaderboard && (
          <>
            {/* Top 3 Podium */}
            {data.leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                {/* 2nd Place */}
                <div className="flex flex-col items-center pt-12">
                  <div className="relative">
                    <Avatar className="w-20 h-20 border-4 border-gray-400 shadow-lg">
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white text-2xl font-bold">
                        {data.leaderboard[1].userName.charAt(0).toUpperCase()}
                      </div>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                      2
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mt-4 text-center">
                    {data.leaderboard[1].userName}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-600 mt-1">
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold">
                      {data.leaderboard[1].totalPoints.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-sm mt-2">
                    Level {data.leaderboard[1].level}
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center">
                  <Crown className="w-8 h-8 text-yellow-500 mb-2" />
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-yellow-400 shadow-xl">
                      <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white text-3xl font-bold">
                        {data.leaderboard[0].userName.charAt(0).toUpperCase()}
                      </div>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg">
                      1
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mt-4 text-center">
                    {data.leaderboard[0].userName}
                  </h3>
                  <div className="flex items-center gap-1 text-yellow-700 mt-1">
                    <Zap className="w-5 h-5" />
                    <span className="font-bold text-lg">
                      {data.leaderboard[0].totalPoints.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="bg-yellow-100 rounded-full px-4 py-1 text-sm mt-2 font-semibold">
                    Level {data.leaderboard[0].level}
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center pt-12">
                  <div className="relative">
                    <Avatar className="w-20 h-20 border-4 border-amber-600 shadow-lg">
                      <div className="w-full h-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center text-white text-2xl font-bold">
                        {data.leaderboard[2].userName.charAt(0).toUpperCase()}
                      </div>
                    </Avatar>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                      3
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mt-4 text-center">
                    {data.leaderboard[2].userName}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-700 mt-1">
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold">
                      {data.leaderboard[2].totalPoints.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="bg-amber-100 rounded-full px-3 py-1 text-sm mt-2">
                    Level {data.leaderboard[2].level}
                  </div>
                </div>
              </div>
            )}

            {/* Full Leaderboard Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Full Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.leaderboard.map((entry) => {
                    const isCurrentUser = session?.user?.id === entry.userId;

                    return (
                      <div
                        key={entry.userId}
                        className={`
                          flex items-center gap-4 p-4 rounded-lg border-2 transition
                          ${getRankBgColor(entry.rank)}
                          ${isCurrentUser ? "ring-2 ring-indigo-500" : ""}
                        `}
                      >
                        {/* Rank */}
                        <div className="flex items-center justify-center w-12">
                          {getRankIcon(entry.rank)}
                        </div>

                        {/* Avatar */}
                        <Avatar className="w-12 h-12">
                          <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {entry.userName.charAt(0).toUpperCase()}
                          </div>
                        </Avatar>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg truncate">
                              {entry.userName}
                            </h3>
                            {isCurrentUser && (
                              <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              Level {entry.level}
                            </span>
                            <span className="flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {entry.badges} badges
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              {entry.currentStreak} day streak
                            </span>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-indigo-600 font-bold text-xl">
                            <Zap className="w-5 h-5" />
                            {entry.totalPoints.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">XP</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Your Rank (if not in top 50) */}
            {session?.user?.id &&
              !data.leaderboard.find((e) => e.userId === session.user.id) && (
                <Card className="mt-4 border-2 border-indigo-500">
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-600">
                      <p className="font-semibold">Your Rank</p>
                      <p className="text-sm mt-1">
                        Keep learning to make it to the top 50!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && (!data?.leaderboard || data.leaderboard.length === 0) && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold">No rankings yet</p>
                <p className="text-sm mt-2">
                  Start learning to appear on the leaderboard!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
