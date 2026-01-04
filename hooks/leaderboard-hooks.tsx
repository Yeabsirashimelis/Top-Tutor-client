import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userEmail: string;
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  badges: number;
  totalLecturesCompleted: number;
  totalQuizzesPassed: number;
  totalCoursesCompleted: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total: number;
  timeframe: string;
}

export const getLeaderboard = async (
  limit: number = 50,
  timeframe: string = "all-time",
  courseId?: string
) => {
  const params = new URLSearchParams({
    limit: limit.toString(),
    timeframe,
  });

  if (courseId) {
    params.append("courseId", courseId);
  }

  const res = await betterFetch<LeaderboardResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/leaderboard?${params.toString()}`
  );
  return res.data;
};

export const useGetLeaderboard = (
  limit: number = 50,
  timeframe: string = "all-time",
  courseId?: string
) => {
  return useQuery({
    queryKey: ["leaderboard", limit, timeframe, courseId],
    queryFn: () => getLeaderboard(limit, timeframe, courseId),
    staleTime: 60000, // 1 minute
  });
};
