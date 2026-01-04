"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GamificationDashboard from "@/components/gamification/gamification-dashboard";
import BadgesShowcase from "@/components/gamification/badges-showcase";
import StreakTracker from "@/components/gamification/streak-tracker";
import { useGetCourseProgress } from "@/hooks/course-progress-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Award, TrendingUp, Target, Flame } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {session.user.name || "Learner"}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Track your learning progress and achievements
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="overview" onClick={() => router.push("/dashboard?tab=overview")}>
              <Book className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="achievements" onClick={() => router.push("/dashboard?tab=achievements")}>
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="progress" onClick={() => router.push("/dashboard?tab=progress")}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("achievements")}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                    <Award className="w-4 h-4" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">
                    View All
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Badges & rewards</p>
                </CardContent>
              </Card>

              <Link href="/profile">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                      <Target className="w-4 h-4" />
                      Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      View
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Your stats</p>
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Gamification Stats */}
              <div className="lg:col-span-2 space-y-6">
                <GamificationDashboard userId={userId} />
              </div>

              {/* Right Column - Streak Tracker */}
              <div className="lg:col-span-1">
                <StreakTracker userId={userId} />
              </div>
            </div>

            {/* Continue Learning Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  Continue Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    You don't have any courses in progress yet
                  </p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Browse Courses
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <BadgesShowcase userId={userId} />
              </div>
              <div className="lg:col-span-1">
                <StreakTracker userId={userId} />
              </div>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-8">
            <GamificationDashboard userId={userId} />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  Course Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Track your progress across all enrolled courses
                  </p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    View My Courses
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
