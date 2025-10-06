"use client";

import { useGetCourses } from "@/hooks/course-hooks";
import CourseCard from "./course-card";
import Spinner from "../spinner";

export default function PopularCourses() {
  const { data, isPending: isLoadingCourses, error } = useGetCourses();

  if (isLoadingCourses) {
    return <Spinner loading={isLoadingCourses} />;
  }

  if (error) {
    return (
      <div className="mt-16  bg-indigo-50">
        <h2>can't fetch popular courses</h2>
      </div>
    );
  }

  return (
    <div className="mt-16  bg-indigo-50">
      <div className="w-[95%] mx-auto px-4 py-6">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 tracking-tight mb-6">
            POPULAR COURSES FOR YOU
          </h2>
          <p className="text-sm">
            Get this best courses with best price from world class tutors
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full mx-auto gap-4 px-6 mt-10">
          {data.map((d) => (
            <CourseCard {...d} key={d._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
