import { betterFetch } from "@better-fetch/fetch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  DailyChallenge,
  UserChallengeProgress,
  ChallengeType,
  DailyChallengesResponse,
} from "@/types/gamification";

// Re-export types for convenience
export type { DailyChallenge, UserChallengeProgress, ChallengeType };

// Response type for course-specific challenges
export interface CourseChallengesResponse {
  courseId: string;
  courseName?: string;
  challenges: DailyChallenge[];
  userProgress: UserChallengeProgress[];
}

// Normalized challenge with progress for UI
export interface NormalizedChallenge {
  id: string;
  courseId: string;
  courseName?: string;
  type: ChallengeType;
  target: number;
  points: number;
  description: string;
  progress: number;
  completed: boolean;
}

// Get challenges for a specific course
export const getCourseChallenges = async (
  userId: string,
  courseId: string
): Promise<DailyChallengesResponse | undefined> => {
  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/courses/${courseId}/challenges?userId=${userId}`;
  const res = await betterFetch<DailyChallengesResponse>(endpoint);
  return res.data ?? undefined;
};

// Get all challenges (legacy endpoint - kept for backward compatibility)
export const getDailyChallenges = async (
  userId: string
): Promise<DailyChallengesResponse | undefined> => {
  const today = new Date().toISOString().split("T")[0];
  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/challenges?userId=${userId}&date=${today}`;
  const res = await betterFetch<DailyChallengesResponse>(endpoint);
  return res.data ?? undefined;
};

export const useGetDailyChallenges = (userId?: string) => {
  return useQuery({
    queryKey: ["daily-challenges", userId],
    queryFn: () => getDailyChallenges(userId!),
    enabled: !!userId,
    refetchInterval: 60000, // Refetch every minute
  });
};

// Get challenges for all enrolled courses
export const useGetAllCourseChallenges = (
  userId?: string,
  courseIds?: string[]
) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["all-course-challenges", userId, courseIds],
    queryFn: async (): Promise<NormalizedChallenge[]> => {
      if (!courseIds || courseIds.length === 0) {
        return [];
      }

      // Fetch challenges for all enrolled courses in parallel
      const results = await Promise.allSettled(
        courseIds.map(async (courseId) => {
          const data = await getCourseChallenges(userId!, courseId);
          return { courseId, data };
        })
      );

      // Process and normalize the challenges
      const normalizedChallenges: NormalizedChallenge[] = [];

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value.data) {
          const { courseId, data } = result.value;

          // Handle both array and single challenge response formats
          const challengesList = Array.isArray(data.challenges)
            ? data.challenges
            : data.challenges
            ? [data.challenges]
            : [];

          const progressList = Array.isArray(data.userProgress)
            ? data.userProgress
            : data.userProgress
            ? [data.userProgress]
            : [];

          challengesList.forEach((dailyChallenge) => {
            dailyChallenge.challenges.forEach((challenge, index) => {
              // Find matching progress
              const userProgressEntry = progressList.find(
                (p) =>
                  p.courseId === courseId ||
                  new Date(p.date).toDateString() ===
                    new Date(dailyChallenge.date).toDateString()
              );

              const challengeProgress = userProgressEntry?.challenges?.find(
                (cp) => cp.type === challenge.type
              );

              normalizedChallenges.push({
                id: `${courseId}-${dailyChallenge._id}-${index}`,
                courseId,
                type: challenge.type,
                target: challenge.target,
                points: challenge.points,
                description: challenge.description,
                progress: challengeProgress?.progress ?? 0,
                completed: challengeProgress?.completed ?? false,
              });
            });
          });
        }
      });

      return normalizedChallenges;
    },
    enabled: !!userId && !!courseIds && courseIds.length > 0,
    refetchInterval: 60000, // Refetch every minute
  });
};

// Complete a daily challenge
export interface CompleteChallengeResponse {
  success: boolean;
  pointsAwarded: number;
  challengeCompleted: boolean;
  allChallengesCompleted: boolean;
  bonusPoints?: number;
}

export const useCompleteDailyChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      challengeType,
      courseId,
    }: {
      userId: string;
      challengeType: ChallengeType;
      courseId?: string;
    }): Promise<CompleteChallengeResponse | undefined> => {
      const res = await betterFetch<CompleteChallengeResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/challenges/complete`,
        {
          method: "POST",
          body: JSON.stringify({ userId, challengeType, courseId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data ?? undefined;
    },
    onSuccess: (data, variables) => {
      // Invalidate challenge queries
      queryClient.invalidateQueries({
        queryKey: ["daily-challenges", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-course-challenges", variables.userId],
      });
      // Invalidate gamification profile as points may have changed
      queryClient.invalidateQueries({
        queryKey: ["gamification", variables.userId],
      });
    },
  });
};

// Helper to calculate overall challenge stats
export const calculateChallengeStats = (challenges: NormalizedChallenge[]) => {
  const total = challenges.length;
  const completed = challenges.filter((c) => c.completed).length;
  const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);
  const earnedPoints = challenges
    .filter((c) => c.completed)
    .reduce((sum, c) => sum + c.points, 0);

  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    totalPoints,
    earnedPoints,
    allCompleted: total > 0 && completed === total,
  };
};
