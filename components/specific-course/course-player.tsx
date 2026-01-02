"use client";

import AdvancedVideoPlayer from "../video-player/advanced-video-player";

interface Lecture {
  _id: string;
  title: string;
  videoUrl?: string;
  subtitles?: { language: string; url: string }[];
}

interface CoursePlayerProps {
  lecture?: Lecture | null;
  courseId: string;
  onLectureComplete?: () => void;
}

export default function CoursePlayer({
  lecture,
  courseId,
  onLectureComplete,
}: CoursePlayerProps) {
  return (
    <AdvancedVideoPlayer
      lecture={lecture}
      courseId={courseId}
      onLectureComplete={onLectureComplete}
    />
  );
}
