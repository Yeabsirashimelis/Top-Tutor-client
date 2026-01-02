import { betterFetch } from "@better-fetch/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface UserGamificationProfile {
  _id: string;
  user: string;
  totalPoints: number;
  level: number;
  currentLevelPoints: number;
  pointsToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  badges: Array<{
    badgeId: string;
    earnedAt: Date;
    progress: number;
  }>;
  totalLecturesCompleted: number;
  totalQuizzesPassed: number;
  totalCoursesCompleted: number;
  totalStudyTimeMinutes: number;
}

export interface PointTransaction {
  _id: string;
  user: string;
  points: number;
  type: string;
  description: string;
  createdAt: Date;
}

// Get user's gamification profile
export const getGamificationProfile = async (userId: string) => {
  const res = await betterFetch<{
    profile: UserGamificationProfile;
    recentTransactions: PointTransaction[];
  }>(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification?userId=${userId}`);
  return res.data;
};

export const useGetGamificationProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["gamification", userId],
    queryFn: () => getGamificationProfile(userId!),
    enabled: !!userId,
  });
};

// Award points to user
export const useAwardPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      points,
      type,
      description,
      metadata,
    }: {
      userId: string;
      points: number;
      type: string;
      description?: string;
      metadata?: any;
    }) => {
      const res = await betterFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification`,
        {
          method: "POST",
          body: JSON.stringify({ userId, points, type, description, metadata }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gamification", variables.userId] });
    },
  });
};

// Update streak
export const useUpdateStreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const res = await betterFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/streak`,
        {
          method: "POST",
          body: JSON.stringify({ userId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gamification", variables.userId] });
    },
  });
};

// Get badges
export const useGetBadges = (userId?: string) => {
  return useQuery({
    queryKey: ["badges", userId],
    queryFn: async () => {
      const url = userId
        ? `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/badges?userId=${userId}`
        : `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/badges`;
      
      const res = await betterFetch<{
        badges: any[];
        userBadges: any[];
      }>(url);
      return res.data;
    },
  });
};

// Award badge
export const useAwardBadge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, badgeId }: { userId: string; badgeId: string }) => {
      const res = await betterFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/badges`,
        {
          method: "POST",
          body: JSON.stringify({ userId, badgeId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gamification", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["badges", variables.userId] });
    },
  });
};
