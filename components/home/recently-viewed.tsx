"use client";

import { useSession } from "next-auth/react";
import { useGetRecentlyViewed } from "@/hooks/recently-viewed-hooks";
import CourseCard from "./course-card";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function RecentlyViewed() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: recentlyViewed, isLoading } = useGetRecentlyViewed(userId, 8);

  if (!userId || isLoading || !recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-16 md:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-green-300/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-[95%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-8 h-8 text-emerald-600" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Recently Viewed
            </h2>
          </div>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Pick up where you left off
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentlyViewed.map((item: any, index: number) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CourseCard
                {...item.course}
                _id={item.course._id}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
