// hooks/course-access-hooks.ts
import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";

export const getCourseAccess = async (courseId: string, userId: string) => {
  const res = await betterFetch<{ access: boolean }>(
    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/courses/${courseId}/access?userId=${userId}`
  );
  return res.data?.access || false;
};

export const useCourseAccess = (courseId: string, userId?: string) => {
  return useQuery({
    queryKey: ["course-access", courseId, userId],
    enabled: !!userId,
    queryFn: () => getCourseAccess(courseId, userId!),
  });
};
