import { betterFetch } from "@better-fetch/fetch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

export const useSubmitQuizAttempt = () =>
  useMutation({
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
  });
