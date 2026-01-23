import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";

export interface EnrolledCourse {
  _id: string;
  title: string;
  thumbnail?: string;
  coverImage?: string;
  progress?: number;
  totalLectures?: number;
  completedLectures?: number;
  lastAccessedAt?: Date;
}

export interface EnrolledCoursesResponse {
  enrolledCourses: EnrolledCourse[];
  total: number;
}

export const getEnrolledCourses = async (
  userId: string
): Promise<EnrolledCoursesResponse | undefined> => {
  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/course-progress?userId=${userId}`;
  const res = await betterFetch<EnrolledCoursesResponse>(endpoint);
  return res.data ?? undefined;
};

export const useGetEnrolledCourses = (userId?: string) => {
  return useQuery({
    queryKey: ["enrolled-courses", userId],
    queryFn: () => getEnrolledCourses(userId!),
    enabled: !!userId,
  });
};
