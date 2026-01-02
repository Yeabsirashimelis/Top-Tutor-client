"use client";

import { useGetCourses } from "@/hooks/course-hooks";
import CourseCard from "./course-card";
import { useMemo } from "react";
import { Course } from "@/types/types";

interface RelatedCoursesProps {
  currentCourse: Course;
  limit?: number;
}

export default function RelatedCourses({ currentCourse, limit = 4 }: RelatedCoursesProps) {
  const { data: allCourses, isLoading } = useGetCourses();

  // Find related courses based on category, skill level, and language
  const relatedCourses = useMemo(() => {
    if (!allCourses || !currentCourse) return [];

    return allCourses
      .filter((course) => {
        // Exclude the current course
        if (course._id === currentCourse._id) return false;

        // Calculate relevance score
        let score = 0;
        
        // Same category (highest priority)
        if (course.courseType === currentCourse.courseType) score += 3;
        
        // Same skill level
        if (course.skillLevel === currentCourse.skillLevel) score += 2;
        
        // Same language
        if (course.language === currentCourse.language) score += 1;
        
        // Must have at least some relevance
        return score > 0;
      })
      .sort((a, b) => {
        // Calculate scores for sorting
        let scoreA = 0;
        let scoreB = 0;

        if (a.courseType === currentCourse.courseType) scoreA += 3;
        if (a.skillLevel === currentCourse.skillLevel) scoreA += 2;
        if (a.language === currentCourse.language) scoreA += 1;

        if (b.courseType === currentCourse.courseType) scoreB += 3;
        if (b.skillLevel === currentCourse.skillLevel) scoreB += 2;
        if (b.language === currentCourse.language) scoreB += 1;

        // If scores are equal, sort by rating
        if (scoreA === scoreB) {
          return (b.ratingsAverage || 0) - (a.ratingsAverage || 0);
        }

        return scoreB - scoreA;
      })
      .slice(0, limit);
  }, [allCourses, currentCourse, limit]);

  if (isLoading || !relatedCourses || relatedCourses.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Related Courses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {relatedCourses.map((course) => (
          <CourseCard key={course._id} {...course} />
        ))}
      </div>
    </section>
  );
}
