"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetGamificationProfile } from "@/hooks/gamification-hooks";
import { useGetEnrolledCourses } from "@/hooks/enrolled-courses-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import BadgesShowcase from "@/components/gamification/badges-showcase";
import StreakTracker from "@/components/gamification/streak-tracker";
import GamificationDashboard from "@/components/gamification/gamification-dashboard";
import DailyChallenges from "@/components/gamification/daily-challenges";
import {
  Trophy,
  Award,
  TrendingUp,
  BookOpen,
  Star,
  Flame,
  Zap,
  LayoutDashboard,
  PlayCircle,
  ChevronRight,
} from "lucide-react";

// Skeleton components for loading states
function ProfileHeaderSkeleton() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg overflow-hidden mb-8">
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 rounded-full bg-white/20 animate-pulse" />
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="h-8 w-48 bg-white/20 rounded animate-pulse mx-auto md:mx-0" />
            <div className="h-4 w-32 bg-white/20 rounded animate-pulse mx-auto md:mx-0" />
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-28 bg-white/20 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="min-w-[280px] bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-2 w-full bg-gray-200 rounded" />
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const userId = session?.user?.id;
  const { data: gamificationData, isLoading } = useGetGamificationProfile(userId);
  const { data: enrolledCoursesData, isLoading: coursesLoading } = useGetEnrolledCourses(userId);

  // Extract course IDs from enrolled courses
  const courseIds = enrolledCoursesData?.enrolledCourses?.map((course) => course._id) || [];

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfileHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const profile = gamificationData?.profile;
  const enrolledCourses = enrolledCoursesData?.enrolledCourses || [];

  return (
    <div className="min-h-screen bg-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </Avatar>
                {profile && profile.level && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white">
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

        {/* Continue Learning Section */}
        {enrolledCourses.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-indigo-600" />
                Continue Learning
              </h2>
              <Link
                href="/courses"
                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gray-300">
              {coursesLoading
                ? [...Array(3)].map((_, i) => <CourseCardSkeleton key={i} />)
                : enrolledCourses.slice(0, 5).map((course) => (
                    <Link
                      key={course._id}
                      href={`/courses/${course._id}`}
                      className="min-w-[280px] max-w-[280px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all group"
                    >
                      <div className="relative h-40 bg-gradient-to-br from-indigo-500 to-purple-600">
                        {(course.thumbnail || course.coverImage) ? (
                          <Image
                            src={course.thumbnail || course.coverImage || ""}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-white font-semibold line-clamp-2 text-sm">
                            {course.title}
                          </h3>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">
                            {course.completedLectures ?? 0}/{course.totalLectures ?? 0} lectures
                          </span>
                          <span className="text-sm font-semibold text-indigo-600">
                            {course.progress ?? 0}%
                          </span>
                        </div>
                        <Progress value={course.progress ?? 0} className="h-2" />
                        <button className="mt-3 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium group-hover:bg-indigo-100 transition">
                          Continue
                        </button>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        )}

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/courses">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  Browse Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">Explore</div>
                <p className="text-xs text-gray-500 mt-1">Discover new courses</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/wishlist">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4" />
                  Wishlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-indigo-600">View</div>
                <p className="text-xs text-gray-500 mt-1">Saved courses</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/leaderboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">Compete</div>
                <p className="text-xs text-gray-500 mt-1">See rankings</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Achievements
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
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            {userId && <BadgesShowcase userId={userId} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
