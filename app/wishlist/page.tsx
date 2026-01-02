"use client";

import { useSession } from "next-auth/react";
import { useGetWishlist } from "@/hooks/wishlist-hooks";
import CourseCard from "@/components/home/course-card";
import Spinner from "@/components/spinner";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: wishlist, isLoading } = useGetWishlist(userId);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Sign in to view your wishlist
          </h2>
          <p className="text-gray-500 mb-6">
            Save courses you're interested in for later
          </p>
          <Link
            href="/signin"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner loading={isLoading} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-[95%] max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="w-8 h-8 text-indigo-600" />
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">
            {wishlist?.length || 0} course{wishlist?.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {wishlist && wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item: any) => (
              <CourseCard
                key={item._id}
                {...item.course}
                _id={item.course._id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Explore courses and save the ones you like!
            </p>
            <Link
              href="/courses"
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
