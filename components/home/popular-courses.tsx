"use client";

import { useGetCourses } from "@/hooks/course-hooks";
import CourseCard from "./course-card";
import Spinner from "../spinner";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

export default function PopularCourses() {
  const { data, isPending: isLoadingCourses, error } = useGetCourses();

  if (isLoadingCourses) {
    return <Spinner loading={isLoadingCourses} />;
  }

  if (error) {
    return (
      <div className="mt-16 bg-gradient-to-br from-emerald-50 to-green-50 py-12">
        <h2 className="text-center text-red-600">Can't fetch popular courses</h2>
      </div>
    );
  }

  return (
    <section className="relative w-full py-16 md:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black" />

      <div className="relative z-10 w-[95%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-8 h-8 text-lime-400" />
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-white">Popular</span>{" "}
              <span className="text-lime-400">Courses</span>
            </h2>
          </div>
          <p className="text-white/70 text-lg">
            Discover the best courses from world-class instructors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
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
