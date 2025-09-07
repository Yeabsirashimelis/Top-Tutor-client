"use client";

import { useGetCourses } from "@/hooks/course-hooks";
import CourseCard from "../home/course-card";

export default function CourseList() {
  const { data: courses } = useGetCourses();
  console.log(courses);
  return (
    <div className="mt-8">
      <div className="w-[95%] mx-auto px-4 py-3">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 tracking-tight mb-6">
            POPULAR COURSES FOR YOU
          </h2>
        </div>
        {courses?.length && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 w-full mx-auto gap-4 px-6 mt-8">
            {courses.map((d) => (
              <CourseCard {...d} key={d._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
