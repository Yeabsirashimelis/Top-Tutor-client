"use client";

import { useRef } from "react";
import { useLectureProgress } from "@/hooks/lecture-progress-hooks";
import { useSession } from "next-auth/react";

interface Lecture {
  _id: string;
  title: string;
  videoUrl?: string;
}

interface CoursePlayerProps {
  lecture?: Lecture | null;
  courseId: string;
  /** Called when the current lecture is fully watched and marked complete */
  onLectureComplete?: () => void;
}

export default function CoursePlayer({
  lecture,
  courseId,
  onLectureComplete,
}: CoursePlayerProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const videoRef = useRef<HTMLVideoElement>(null);

  const lectureProgress = useLectureProgress(userId!, courseId);

  const handleVideoEnded = () => {
    if (!lecture || !userId) return;

    // Mark lecture complete in the backend
    lectureProgress.mutate(
      {
        lectureId: lecture._id,
        lastPosition: 0,
        isCompleted: true,
      },
      {
        onSuccess: () => {
          // Hand control back to parent (could be next lecture or a quiz)
          onLectureComplete?.();
        },
      }
    );
  };

  if (!lecture) {
    return (
      <div className="flex items-center justify-center relative bg-black w-full aspect-video text-white">
        No lecture selected
      </div>
    );
  }

  return (
    <div className="relative bg-black w-full aspect-video">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        src={lecture.videoUrl}
        onEnded={handleVideoEnded}
        poster="/placeholder-video.jpg" // change to your poster image
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
