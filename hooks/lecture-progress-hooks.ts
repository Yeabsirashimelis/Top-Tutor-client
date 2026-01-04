import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAwardPoints } from "./gamification-hooks";

export function useLectureProgress(userId: string, courseId: string) {
  const queryClient = useQueryClient();
  const { mutateAsync: awardPoints } = useAwardPoints();

  return useMutation({
    mutationFn: async (data: {
      lectureId: string;
      lastPosition: number;
      isCompleted?: boolean;
    }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/course-progress/${courseId}/lecture/${data.lectureId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            lastPosition: data.lastPosition,
            isCompleted: data.isCompleted,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update lecture progress");
      }

      return res.json();
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress", userId, courseId],
      });

      // Award points when lecture is completed
      if (variables.isCompleted) {
        try {
          await awardPoints({
            userId,
            points: 10,
            type: "lecture_completed",
            description: "Completed a lecture",
            metadata: {
              courseId,
              lectureId: variables.lectureId,
            },
          });
        } catch (error) {
          console.error("Failed to award points for lecture completion:", error);
        }
      }
    },
  });
}
