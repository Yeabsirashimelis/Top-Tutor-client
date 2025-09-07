import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useQuizProgress(userId: string, courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      quizId: string;
      score: number;
      passed: boolean;
    }) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/course-progress/${courseId}/quiz/${data.quizId}`,
        { userId, score: data.score, passed: data.passed }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress", userId, courseId],
      });
    },
  });
}
