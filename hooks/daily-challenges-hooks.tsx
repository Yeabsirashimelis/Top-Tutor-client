import { betterFetch } from "@better-fetch/fetch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface DailyChallenge {
  _id: string;
  date: Date;
  challenges: {
    type: "complete_lecture" | "pass_quiz" | "study_time" | "perfect_quiz" | "complete_section";
    target: number;
    points: number;
    description: string;
  }[];
}

export interface UserChallengeProgress {
  _id: string;
  user: string;
  date: Date;
  challenges: {
    type: string;
    completed: boolean;
    progress: number;
    target: number;
  }[];
}

export const getDailyChallenges = async (userId: string, courseId?: string) => {
  const today = new Date().toISOString().split("T")[0];
  
  // If courseId provided, get challenges for specific course
  if (courseId) {
    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/courses/${courseId}/challenges?userId=${userId}`;
    console.log(`🔗 [DAILY CHALLENGES] Calling endpoint: ${endpoint}`);
    const res = await betterFetch<{ challenges: DailyChallenge[]; userProgress: UserChallengeProgress[] }>(endpoint);
    console.log(`📦 [DAILY CHALLENGES] Response for ${courseId}:`, res.data);
    return res.data;
  }
  
  // Otherwise get all challenges (legacy endpoint - needs updating)
  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/challenges?userId=${userId}&date=${today}`;
  console.log(`🔗 [DAILY CHALLENGES] Calling legacy endpoint: ${endpoint}`);
  const res = await betterFetch<{ challenge: DailyChallenge; userProgress: UserChallengeProgress }>(endpoint);
  console.log(`📦 [DAILY CHALLENGES] Legacy response:`, res.data);
  return res.data;
};

export const useGetDailyChallenges = (userId?: string, courseId?: string) => {
  return useQuery({
    queryKey: ["daily-challenges", userId, courseId],
    queryFn: () => getDailyChallenges(userId!, courseId),
    enabled: !!userId,
    refetchInterval: 60000, // Refetch every minute to update progress
  });
};

// Get challenges for all enrolled courses
export const useGetAllCourseChallenges = (userId?: string, courseIds?: string[]) => {
  return useQuery({
    queryKey: ["all-course-challenges", userId, courseIds],
    queryFn: async () => {
      console.log("🎯 [DAILY CHALLENGES] Fetching challenges for:", {
        userId,
        courseIds,
        courseCount: courseIds?.length || 0
      });

      if (!courseIds || courseIds.length === 0) {
        console.log("⚠️ [DAILY CHALLENGES] No enrolled courses found");
        return { challenges: [], progress: [] };
      }

      // Fetch challenges for all enrolled courses
      const results = await Promise.all(
        courseIds.map(async (courseId) => {
          try {
            console.log(`📚 [DAILY CHALLENGES] Fetching for course: ${courseId}`);
            const data = await getDailyChallenges(userId!, courseId);
            console.log(`✅ [DAILY CHALLENGES] Data for ${courseId}:`, data);
            return { courseId, ...data };
          } catch (error) {
            console.error(`❌ [DAILY CHALLENGES] Error fetching challenges for course ${courseId}:`, error);
            return null;
          }
        })
      );

      const filtered = results.filter(Boolean);
      console.log("📊 [DAILY CHALLENGES] Final results:", {
        totalResults: filtered.length,
        results: filtered
      });

      return filtered;
    },
    enabled: !!userId && !!courseIds && courseIds.length > 0,
    refetchInterval: 60000,
  });
};

export const useCompleteDailyChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      challengeType,
    }: {
      userId: string;
      challengeType: string;
    }) => {
      const res = await betterFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification/challenges/complete`,
        {
          method: "POST",
          body: JSON.stringify({ userId, challengeType }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["daily-challenges", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["gamification", variables.userId],
      });
    },
  });
};
