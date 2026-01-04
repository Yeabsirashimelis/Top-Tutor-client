import { betterFetch } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";

export interface EnrolledCourse {
  _id: string;
  title: string;
  thumbnail?: string;
  progress?: number;
}

export const getEnrolledCourses = async (userId: string) => {
  console.log("📚 [ENROLLED COURSES] Fetching enrolled courses for userId:", userId);
  const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/course-progress?userId=${userId}`;
  console.log("🔗 [ENROLLED COURSES] Endpoint:", endpoint);
  
  // Get user's progress to find enrolled courses
  const res = await betterFetch<{ enrolledCourses: EnrolledCourse[] }>(endpoint);
  
  console.log("📦 [ENROLLED COURSES] Response:", {
    enrolledCoursesCount: res.data?.enrolledCourses?.length || 0,
    enrolledCourses: res.data?.enrolledCourses
  });
  
  return res.data;
};

export const useGetEnrolledCourses = (userId?: string) => {
  return useQuery({
    queryKey: ["enrolled-courses", userId],
    queryFn: () => getEnrolledCourses(userId!),
    enabled: !!userId,
  });
};
