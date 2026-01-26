"use client";

import { useGetCourses } from "@/hooks/course-hooks";
import CourseCard from "./course-card";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";

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
    <section className="relative w-full py-16 md:py-20 overflow-hidden bg-white">
      <div className="relative z-10 w-[95%] max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-gray-900">Trending</span>{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Courses</span>
            </h2>
          </div>
          <p className="text-gray-600 text-lg">
            Most popular courses based on student ratings and enrollments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingCourses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CourseCard {...course} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
