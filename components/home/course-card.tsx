"use client";

import Image from "next/image";
import { Star, BookOpen, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Course } from "@/types/types";
import WishlistButton from "../courses/wishlist-button";
import { motion } from "framer-motion";
import { useState } from "react";

interface CourseCardProps extends Course {}

export default function CourseCard(course: CourseCardProps) {
  const router = useRouter();
  const { _id, title, courseType, coverImage, ratingsAverage, instructor } =
    course;
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
    >
      <Card className="group relative overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-lime-400 transition-all duration-300 bg-white hover:shadow-xl hover:shadow-lime-400/20">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/0 to-lime-400/10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-0" />

        <div onClick={() => router.push(`/courses/${_id}`)} className="relative z-10">
          <CardHeader className="p-0 relative overflow-hidden">
            <div className="relative h-52 w-full overflow-hidden">
              {coverImage ? (
                <Image 
                  src={coverImage} 
                  alt={title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              ) : (
                <div className="bg-gradient-to-br from-gray-700 to-emerald-900 h-full w-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-emerald-400" />
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <Badge
                variant="secondary"
                className="absolute top-3 left-3 bg-white text-black font-bold border-2 border-lime-400 shadow-lg text-xs"
              >
                {courseType}
              </Badge>
              
              {/* Wishlist button */}
              <motion.div 
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg border-2 border-lime-400 opacity-0 group-hover:opacity-100"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                <WishlistButton courseId={_id} />
              </motion.div>

              {/* Poker suits corner accent */}
              <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {["♠", "♥", "♣", "♦"].map((suit, i) => (
                  <span key={i} className={`text-2xl font-bold ${i % 2 === 0 ? 'text-lime-400' : 'text-white'}`}>
                    {suit}
                  </span>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-4 py-4 space-y-3">
            <h3 className="text-lg font-bold text-black line-clamp-2 group-hover:text-lime-600 transition-colors duration-300">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-lime-400 flex items-center justify-center text-black font-bold text-xs border-2 border-white">
                {instructor?.name?.[0] || "?"}
              </div>
              <p className="text-gray-700 font-medium">
                {instructor ? instructor.name : "Unknown"}
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between border-t-2 border-gray-100 mt-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(ratingsAverage || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-black">
                {ratingsAverage?.toFixed(1) || "0.0"}
              </span>
            </div>
            
            <motion.div
              className="px-4 py-2 bg-white text-black text-xs font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-lime-400"
              whileHover={{ scale: 1.05 }}
            >
              View Course
            </motion.div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}
