import { betterFetch } from "@better-fetch/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UserGamificationProfile,
  PointTransaction,
  PointTransactionType,
  PointTransactionMetadata,
  GamificationProfileResponse,
  AwardPointsResponse,
  BadgesResponse,
  Badge,
  UserBadge,
} from "@/types/gamification";

// Re-export types for convenience
export type { UserGamificationProfile, PointTransaction, Badge, UserBadge };

// Get user's gamification profile
export const getGamificationProfile = async (
  userId: string
): Promise<GamificationProfileResponse | undefined> => {
  const res = await betterFetch<GamificationProfileResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification?userId=${userId}`
  );
  return res.data ?? undefined;
};

export const useGetGamificationProfile = (userId?: string) => {
  return useQuery({
    queryKey: ["gamification", userId],
    queryFn: () => getGamificationProfile(userId!),
    enabled: !!userId,
  });
};

// Award points to user
export interface AwardPointsParams {
  userId: string;
  points: number;
  type: PointTransactionType | string;
  description?: string;
  metadata?: PointTransactionMetadata;
}

export const awardPoints = async (
  params: AwardPointsParams
): Promise<AwardPointsResponse | undefined> => {
  const res = await betterFetch<AwardPointsResponse>(
    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification`,
    {
      method: "POST",
      body: JSON.stringify(params),
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data ?? undefined;
};

export const useAwardPoints = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: awardPoints,
    onSuccess: (data, variables) => {
      // Invalidate gamification profile
      queryClient.invalidateQueries({
        queryKey: ["gamification", variables.userId],
      });
      // Invalidate daily challenges so progress updates immediately
      queryClient.invalidateQueries({
        queryKey: ["daily-challenges", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-course-challenges", variables.userId],
      });
      // Invalidate leaderboard as points changed
      queryClient.invalidateQueries({
        queryKey: ["leaderboard"],
      });
    },
  });
};

// Update streak
export interface UpdateStreakResponse {
  success: boolean;
  profile: UserGamificationProfile;
  streakBonusAwarded?: number;
}

export const useUpdateStreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
    }: {
      userId: string;
    }): Promise<UpdateStreakResponse | undefined> => {
      const res = await betterFetch<UpdateStreakResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/streak`,
        {
          method: "POST",
          body: JSON.stringify({ userId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data ?? undefined;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["gamification", variables.userId],
      });
    },
  });
};

// Get badges
export const getBadges = async (
  userId?: string
): Promise<BadgesResponse | undefined> => {
  const url = userId
    ? `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/badges?userId=${userId}`
    : `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/badges`;

  const res = await betterFetch<BadgesResponse>(url);
  return res.data ?? undefined;
};

export const useGetBadges = (userId?: string) => {
  return useQuery({
    queryKey: ["badges", userId],
    queryFn: () => getBadges(userId),
  });
};

// Award badge
export interface AwardBadgeResponse {
  success: boolean;
  badge: Badge;
  userBadge: UserBadge;
  pointsAwarded: number;
}

export const useAwardBadge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      badgeId,
    }: {
      userId: string;
      badgeId: string;
    }): Promise<AwardBadgeResponse | undefined> => {
      const res = await betterFetch<AwardBadgeResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/badges`,
        {
          method: "POST",
          body: JSON.stringify({ userId, badgeId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data ?? undefined;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["gamification", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["badges", variables.userId],
      });
    },
  });
};

// Helper to check for level up from API response
export const checkLevelUp = (
  response: AwardPointsResponse | undefined
): { leveledUp: boolean; newLevel: number } => {
  if (!response?.profile) {
    return { leveledUp: false, newLevel: 0 };
  }

  return {
    leveledUp: response.leveledUp ?? false,
    newLevel: response.profile.level,
  };
};
