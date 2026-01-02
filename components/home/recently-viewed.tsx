"use client";

import { useSession } from "next-auth/react";
import { useGetRecentlyViewed } from "@/hooks/recently-viewed-hooks";
import CourseCard from "./course-card";
import { Clock } from "lucide-react";

export default function RecentlyViewed() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: recentlyViewed, isLoading } = useGetRecentlyViewed(userId, 8);

  if (!userId || isLoading || !recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="w-[95%] mx-auto py-12">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Recently Viewed
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recentlyViewed.map((item: any) => (
          <CourseCard
            key={item._id}
            {...item.course}
            _id={item.course._id}
          />
        ))}
      </div>
    </section>
  );
}
