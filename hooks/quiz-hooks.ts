import { betterFetch } from "@better-fetch/fetch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBadgeNotification } from "./use-badge-notification";
import { showXPToast, showLevelUpToast } from "@/lib/toast-helper";

export interface Quiz {
  _id: string;
  title: string;
  section: string;
  order: number;
  questions: {
    questionText: string;
    options: { text: string; isCorrect: boolean }[];
    explanation?: string;
  }[];
}

export const getQuiz = async (courseId:string, quizId: string, userId?: string) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/quizzes/${quizId}?userId=${userId}&courseId=${courseId}`);
  if (userId) url.searchParams.set("userId", userId);

  const res = await betterFetch<{ quiz: Quiz; progress?: any }>(url.toString());
  return res.data!;
};


export const useGetQuiz = (courseId:string, quizId: string, userId:string) =>
  useQuery({
    queryKey: ["quiz", quizId, userId],
    queryFn: () => getQuiz(courseId,quizId, userId),
    enabled: !!quizId,
  });

export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient();
  const { showBadges } = useBadgeNotification();
  
  return useMutation({
    mutationFn: async ({
      courseId,
      quizId,
      userId,
      score,
      passed,
    }: {
      courseId: string;
      quizId: string;
      userId: string;
      score: number;
      passed: boolean;
    }) =>
      betterFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/courses/${courseId}/quizzes/${quizId}/attempt`,
        {
          method: "POST",
          body: { userId, score, passed },
        }
      ),
    onSuccess: async (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["quiz", variables.quizId, variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-progress", variables.userId, variables.courseId],
      });

      // Award points for passing quiz
      if (variables.passed) {
        console.log("📝 [QUIZ] Quiz passed! Details:", {
          userId: variables.userId,
          courseId: variables.courseId,
          quizId: variables.quizId,
          score: variables.score,
          passed: variables.passed
        });
        try {
          // Base points for passing
          let points = 20;
          let description = "Passed a quiz";
          
          // Bonus for perfect score
          if (variables.score === 100) {
            points = 50;
            description = "Perfect score on quiz!";
          }

          console.log("🎮 [QUIZ] Awarding points:", {
            points,
            type: variables.score === 100 ? "quiz_perfect" : "quiz_passed",
            description
          });

          const result = await betterFetch(
            `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/gamification`,
            {
              method: "POST",
              body: JSON.stringify({
                userId: variables.userId,
                points,
                type: variables.score === 100 ? "quiz_perfect" : "quiz_passed",
                description,
                metadata: {
                  courseId: variables.courseId,
                  quizId: variables.quizId,
                  score: variables.score,
                },
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          console.log("✅ [QUIZ] Points awarded for quiz completion");
          
          // Show XP toast notification
          showXPToast(points, description, variables.score === 100 ? "badge" : "xp");
          
          // Check for level up
          if (result?.data?.profile) {
            const currentLevel = result.data.profile.level;
            const previousLevel = localStorage.getItem(`user_level_${variables.userId}`);
            
            if (previousLevel && parseInt(previousLevel) < currentLevel) {
              showLevelUpToast(currentLevel);
            }
            
            localStorage.setItem(`user_level_${variables.userId}`, currentLevel.toString());
          }
          
          // Show badge notifications if any badges were earned
          if (result?.data?.newBadges && result.data.newBadges.length > 0) {
            console.log("🏆 [QUIZ] Badges earned:", result.data.newBadges);
            showBadges(result.data.newBadges);
          }

          // Invalidate gamification data
          queryClient.invalidateQueries({
            queryKey: ["gamification", variables.userId],
          });
        } catch (error) {
          console.error("❌ [QUIZ] Failed to award points for quiz:", error);
        }
      }
    },
  });
};
