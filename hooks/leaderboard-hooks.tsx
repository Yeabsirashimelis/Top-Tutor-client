import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import type { LeaderboardEntry, LeaderboardResponse } from "@/types/gamification";

// Re-export types
export type { LeaderboardEntry, LeaderboardResponse };

export type TimeFrame = "all-time" | "monthly" | "weekly";

export const getLeaderboard = async (
  limit: number = 50,
  timeframe: TimeFrame = "all-time",
  courseId?: string
): Promise<LeaderboardResponse | undefined> => {
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
  return res.data ?? undefined;
};

export const useGetLeaderboard = (
  limit: number = 50,
  timeframe: TimeFrame = "all-time",
  courseId?: string
) => {
  return useQuery({
    queryKey: ["leaderboard", limit, timeframe, courseId],
    queryFn: () => getLeaderboard(limit, timeframe, courseId),
    staleTime: 60000, // 1 minute
  });
};

// Get user's rank specifically (useful when user is not in top N)
export const getUserRank = async (
  userId: string,
  timeframe: TimeFrame = "all-time"
): Promise<{ rank: number; totalUsers: number } | undefined> => {
  const res = await betterFetch<{ rank: number; totalUsers: number }>(
    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/leaderboard/rank?userId=${userId}&timeframe=${timeframe}`
  );
  return res.data ?? undefined;
};

export const useGetUserRank = (userId?: string, timeframe: TimeFrame = "all-time") => {
  return useQuery({
    queryKey: ["user-rank", userId, timeframe],
    queryFn: () => getUserRank(userId!, timeframe),
    enabled: !!userId,
    staleTime: 60000,
  });
};
