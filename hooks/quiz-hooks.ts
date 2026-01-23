import { betterFetch } from "@better-fetch/fetch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAwardPoints, checkLevelUp } from "./gamification-hooks";
import { useBadgeNotification } from "./use-badge-notification";
import { showXPToast, showLevelUpToast } from "@/lib/toast-helper";
import { POINT_VALUES } from "@/types/gamification";

export interface Quiz {
  _id: string;
  title: string;
  section: string;
  order: number;
  description?: string;
  difficulty?: "easy" | "medium" | "hard";
  timeLimit?: number;
  passingScore?: number;
  maxAttempts?: number;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
  showCorrectAnswers?: boolean;
  questions: {
    questionText: string;
    questionType?: "multiple-choice" | "multiple-select" | "true-false" | "fill-in-blank";
    options: { text: string; isCorrect: boolean }[];
    explanation?: string;
    points?: number;
    correctAnswer?: string;
    caseSensitive?: boolean;
  }[];
}

export interface QuizAttempt {
  _id: string;
  score: number;
  passed: boolean;
  attemptedAt: Date;
  timeTaken?: number;
}

export interface QuizResponse {
  quiz: Quiz;
  progress?: QuizAttempt[];
}

export const getQuiz = async (
  courseId: string,
  quizId: string,
  userId?: string
): Promise<QuizResponse | undefined> => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/quizzes/${quizId}`
  );
  url.searchParams.set("courseId", courseId);
  if (userId) url.searchParams.set("userId", userId);

  const res = await betterFetch<QuizResponse>(url.toString());
  return res.data ?? undefined;
};

export const useGetQuiz = (courseId: string, quizId: string, userId: string) =>
  useQuery({
    queryKey: ["quiz", quizId, userId],
    queryFn: () => getQuiz(courseId, quizId, userId),
    enabled: !!quizId,
  });

export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: awardPoints } = useAwardPoints();
  const { showBadges } = useBadgeNotification();

  return useMutation({
    mutationFn: async ({
      courseId,
      quizId,
      userId,
      score,
      passed,
      answers,
      timeTaken,
    }: {
      courseId: string;
      quizId: string;
      userId: string;
      score: number;
      passed: boolean;
      answers?: { questionIndex: number; answer: unknown }[];
      timeTaken?: number;
    }) =>
      betterFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/courses/${courseId}/quizzes/${quizId}/attempt`,
        {
          method: "POST",
          body: { userId, score, passed, answers, timeTaken },
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

      // Award points for passing quiz using the shared hook
      if (variables.passed) {
        try {
          // Determine points based on score
          const isPerfect = variables.score === 100;
          const points = isPerfect
            ? POINT_VALUES.QUIZ_PERFECT
            : POINT_VALUES.QUIZ_PASSED;
          const type = isPerfect ? "quiz_perfect" : "quiz_passed";
          const description = isPerfect
            ? "Perfect score on quiz!"
            : "Passed a quiz";

          const result = await awardPoints({
            userId: variables.userId,
            points,
            type,
            description,
            metadata: {
              courseId: variables.courseId,
              quizId: variables.quizId,
              score: variables.score,
            },
          });

          // Check if already completed (no duplicate points)
          if (result?.alreadyCompleted) {
            return;
          }

          // Show XP toast notification
          showXPToast(points, description, isPerfect ? "badge" : "xp");

          // Check for level up using the helper
          const { leveledUp, newLevel } = checkLevelUp(result);
          if (leveledUp) {
            showLevelUpToast(newLevel);
          }

          // Show badge notifications if any badges were earned
          if (result?.newBadges && result.newBadges.length > 0) {
            showBadges(result.newBadges);
          }
        } catch (error) {
          // Silently fail - points are a bonus, not critical
        }
      }
    },
  });
};
