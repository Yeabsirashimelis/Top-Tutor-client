import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";

export interface CourseRating {
  courseId: string;
  userId: string;
  rating: number; // 1–5
  reviewText?: string;
}

// Fetch course rating for a user
export const getCourseRating = async (courseId: string, userId: string) => {
  const res = await betterFetch<{ message: string; data: CourseRating }>(
    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/courses/${courseId}/rate?userId=${userId}`
  );
  return res.data?.data || null;
};

// Hook to fetch rating
export const useGetCourseRating = (courseId: string, userId: string) => {
  return useQuery({
    queryKey: ["courseRating", courseId, userId],
    queryFn: () => getCourseRating(courseId, userId),
    enabled: !!courseId && !!userId,
  });
};

// Hook to create/update rating
export const useRateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rating: CourseRating) => {
      const res = await betterFetch<{ message: string; data: CourseRating }>(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/courses/${rating.courseId}/rate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rating),
        }
      );
      return res.data?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["courseRating", variables.courseId, variables.userId],
      });
    },
  });
};
