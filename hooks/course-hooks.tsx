import { Course } from "@/types/types";
import { betterFetch } from "@better-fetch/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const getCourses = async () => {
  const res = await betterFetch<{ message: string; courses: Course[] }>(
    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/courses/all`
  );

  return res.data?.courses || [];
};

export const getCourse = async (id: string) => {
  const res = await betterFetch<{ message: string; course: Course }>(
    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/courses/${id}/contents`
  );
  if (!res.data?.course) {
    throw new Error(res.data?.message || "Course not found");
  }
  return res.data.course;
};

export const useGetCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => getCourses(),
  });
};

export const useGetCourse = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourse(id),
  });
};
