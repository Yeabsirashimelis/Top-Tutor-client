"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetGamificationProfile } from "@/hooks/gamification-hooks";
import { useGetEnrolledCourses } from "@/hooks/enrolled-courses-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import BadgesShowcase from "@/components/gamification/badges-showcase";
import StreakTracker from "@/components/gamification/streak-tracker";
import GamificationDashboard from "@/components/gamification/gamification-dashboard";
import DailyChallenges from "@/components/gamification/daily-challenges";
import {
  Trophy,
  Award,
  TrendingUp,
  Calendar,
  BookOpen,
  CheckCircle,
  Star,
  Flame,
  Zap,
  Target,
  LayoutDashboard,
  Book,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const userId = session?.user?.id;
  const { data: gamificationData, isLoading } = useGetGamificationProfile(userId);
  const { data: enrolledCoursesData } = useGetEnrolledCourses(userId);
  
  // Extract course IDs from enrolled courses
  const courseIds = enrolledCoursesData?.enrolledCourses?.map((course) => course._id) || [];
  
  console.log("📊 [DASHBOARD] Dashboard data:", {
    userId,
    hasGamificationData: !!gamificationData,
    hasEnrolledCoursesData: !!enrolledCoursesData,
    enrolledCoursesCount: enrolledCoursesData?.enrolledCourses?.length || 0,
    courseIds,
    courseIdsCount: courseIds.length
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const profile = gamificationData?.profile;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </Avatar>
                {profile && profile.level && (
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white">
                    {profile.level}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {session.user.name || "Learner"}
                </h1>
                <p className="text-indigo-100 mb-4">{session.user.email}</p>

                {/* Quick Stats */}
                {profile && (
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2 text-white">
                        <Trophy className="w-4 h-4" />
                        <span className="font-semibold">Level {profile.level}</span>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2 text-white">
                        <Zap className="w-4 h-4" />
                        <span className="font-semibold">{profile.totalPoints.toLocaleString()} XP</span>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2 text-white">
                        <Flame className="w-4 h-4" />
                        <span className="font-semibold">{profile.currentStreak} Day Streak</span>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2 text-white">
                        <Award className="w-4 h-4" />
                        <span className="font-semibold">{profile.badges?.length || 0} Badges</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/courses">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <Book className="w-4 h-4" />
                  My Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600">
                  View All
                </div>
                <p className="text-xs text-gray-500 mt-1">Continue learning</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/wishlist">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4" />
                  Wishlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  View
                </div>
                <p className="text-xs text-gray-500 mt-1">Saved courses</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/leaderboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  Compete
                </div>
                <p className="text-xs text-gray-500 mt-1">See rankings</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Daily Challenges */}
            <DailyChallenges userId={userId!} courseIds={courseIds} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Gamification Stats */}
              <div className="lg:col-span-2 space-y-6">
                <GamificationDashboard userId={userId!} />
              </div>

              {/* Right Column - Streak Tracker */}
              <div className="lg:col-span-1">
                <StreakTracker userId={userId!} />
              </div>
            </div>

            {/* Learning Statistics */}
            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Detailed Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <div className="text-3xl font-bold text-indigo-600 mb-1">
                        {profile.totalLecturesCompleted || 0}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        Lectures Completed
                      </div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="text-3xl font-bold text-amber-600 mb-1">
                        {profile.totalQuizzesPassed || 0}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Quizzes Passed
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {profile.totalCoursesCompleted || 0}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                        <Trophy className="w-4 h-4" />
                        Courses Completed
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {Math.floor((profile.totalStudyTimeMinutes || 0) / 60)}h {(profile.totalStudyTimeMinutes || 0) % 60}m
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Total Study Time
                      </div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-3xl font-bold text-red-600 mb-1">
                        {profile.longestStreak || 0}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                        <Flame className="w-4 h-4" />
                        Longest Streak
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600 mb-1">
                        {profile.totalPoints.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                        <Star className="w-4 h-4" />
                        Total XP
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {userId && <BadgesShowcase userId={userId} />}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gamificationData?.recentTransactions && gamificationData.recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {gamificationData.recentTransactions.map((transaction: any) => (
                      <div
                        key={transaction._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Zap className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {transaction.description || transaction.type.replace(/_/g, " ")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">+{transaction.points}</p>
                          <p className="text-xs text-gray-500">XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No recent activity yet</p>
                    <p className="text-sm mt-2">Start learning to earn XP and badges!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
