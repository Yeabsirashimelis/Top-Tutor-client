"use client";

import { useGetCourses } from "@/hooks/course-hooks";
import CourseCard from "./course-card";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";

export default function TrendingCourses() {
  const { data: courses, isLoading } = useGetCourses();

  // Calculate trending based on recent popularity (ratings * quantity)
  const trendingCourses = useMemo(() => {
    if (!courses) return [];

    return [...courses]
      .sort((a, b) => {
        const aScore = (a.ratingsAverage || 0) * (a.ratingsQuantity || 0);
        const bScore = (b.ratingsAverage || 0) * (b.ratingsQuantity || 0);
        return bScore - aScore;
      })
      .slice(0, 8);
  }, [courses]);

  if (isLoading || !trendingCourses || trendingCourses.length === 0) {
    return null;
  }

  return (
    <section className="w-[95%] mx-auto py-12 bg-gradient-to-br from-indigo-50 to-white rounded-2xl">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Trending Now
          </h2>
        </div>
        <p className="text-gray-600 mb-8">
          Most popular courses based on student ratings and enrollments
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingCourses.map((course) => (
            <CourseCard key={course._id} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}
