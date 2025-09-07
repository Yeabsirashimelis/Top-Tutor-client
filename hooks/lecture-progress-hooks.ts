import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLectureProgress(userId: string, courseId: string) {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress", userId, courseId],
      });
    },
  });
}
