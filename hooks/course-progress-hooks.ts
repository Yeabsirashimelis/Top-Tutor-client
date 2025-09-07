import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCourseProgress(
  userId: string,
  courseId: string,
  options?: { enabled?: boolean }
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["course-progress", userId, courseId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/course-progress/${courseId}?user=${userId}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch course progress");
      }

      return res.json();
    },
    enabled: options?.enabled ?? (!!userId && !!courseId),
  });

  const create = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/course-progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: userId,
            course: courseId,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create course progress");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress", userId, courseId],
      });
    },
  });

  return { ...query, create };
}
