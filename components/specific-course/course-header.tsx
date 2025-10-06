"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Share2, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Course } from "@/types/types";
import ShareBtns from "./share-btns";

interface CourseHeaderProps {
  courseTitle: string;
  currentSection?: string;
  currentLecture?: string;
  overallProgress: number;
  userRating: number | null;
  userComment?: string;
  onRateClick?: () => void;
  course: Course;
}

export default function CourseHeader({
  courseTitle,
  currentSection,
  currentLecture,
  overallProgress,
  userRating,
  userComment,
  onRateClick,
  course,
}: CourseHeaderProps) {
  console.log(course);
  const showRatingButton = overallProgress >= 20;
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="border-b relative">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* left */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/courses">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back to courses</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{courseTitle}</h1>
            {currentSection && currentLecture && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{currentSection}</span>
                <span>•</span>
                <span>{currentLecture}</span>
              </div>
            )}
          </div>
        </div>

        {/* right */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{overallProgress}%</span>
          <Progress
            value={overallProgress}
            className="w-24 md:w-40 h-2 [&>[data-state='complete']]:bg-indigo-600"
          />

          {showRatingButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRateClick}
              className="relative flex items-center gap-1"
            >
              <Star className="h-5 w-5 text-yellow-400" />
              {userRating && (
                <span className="text-sm font-medium">{userRating}</span>
              )}
              {userComment && (
                <span className="ml-1 text-xs truncate max-w-[80px]">
                  "{userComment}"
                </span>
              )}
            </Button>
          )}

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowShare((prev) => !prev)}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>

            {showShare && (
              <div className="absolute right-0 top-10 z-50 bg-white shadow-md rounded-md p-2">
                <ShareBtns course={course} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
