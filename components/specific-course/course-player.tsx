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
  goToNextLecture?: () => void;
}

export default function CoursePlayer({
  lecture,
  courseId,
  goToNextLecture,
}: CoursePlayerProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const videoRef = useRef<HTMLVideoElement>(null);

  const lectureProgress = useLectureProgress(userId!, courseId);

  const handleVideoEnded = () => {
    if (!lecture || !userId) return;

    lectureProgress.mutate(
      {
        lectureId: lecture._id,
        lastPosition: 0,
        isCompleted: true,
      },
      {
        onSuccess: () => {
          // Move to next lecture automatically
          if (goToNextLecture) goToNextLecture();
        },
      }
    );
  };

  if (!lecture) {
    return (
      <div className="flex items-center  relative bg-black w-full aspect-video justify-center h-full text-white">
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
        poster="..."
        src={lecture.videoUrl}
        onEnded={handleVideoEnded}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
