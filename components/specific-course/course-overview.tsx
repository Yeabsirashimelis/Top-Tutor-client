import { Course } from "@/types/types";
import {
  Clock,
  BarChart3,
  Award,
  FileText,
  Globe,
  MessageSquare,
  ThumbsUp,
  Star,
} from "lucide-react";
import Image from "next/image";

interface CourseOverviewProps {
  course: Course;
  access?: boolean;
}

export default function CourseOverview({
  course,
  access,
}: CourseOverviewProps) {
  const totalLectures = course.sections.reduce(
    (acc, sec) => acc + sec.lectures.length,
    0
  );

  return (
    <div className="space-y-8">
      {/* Course Cover Image */}
      {course.coverImage && (
        <div className="relative w-full h-60 md:h-80 overflow-hidden rounded-lg">
          <Image
            src={course.coverImage}
            alt={course.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* About This Course */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">About This Course</h3>
        <p>{course.description}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Duration
            </div>
            <p className="text-sm text-muted-foreground">
              Approx. {totalLectures * 10} min
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="h-4 w-4" />
              Skill Level
            </div>
            <p className="text-sm text-muted-foreground">
              {course.skillLevel || "Beginner"}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Lectures
            </div>
            <p className="text-sm text-muted-foreground">
              {totalLectures} lectures
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe className="h-4 w-4" />
              Language
            </div>
            <p className="text-sm text-muted-foreground">
              {course.language || "English"}
            </p>
          </div>
        </div>
      </div>

      {/* Instructor */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Instructor</h3>
        <div className="flex gap-4">
          k
          <Image
            src={course.instructor.avatar}
            alt="Instructor"
            width={64}
            height={64}
            className="rounded-md h-16 w-16 object-cover"
          />
          <div>
            <h4 className="font-medium">{course.instructor.name}</h4>
            <p className="text-sm text-muted-foreground">
              {course.instructor.bio || ""}
            </p>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span>{course.instructor.rating} Instructor Rating</span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {course.instructor.reviewsCount} Reviews
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                {course.instructor.totalStudents} Students
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Access */}
      {!access && (
        <div className="p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium">Get Access to This Course</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Price: ${course.price.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
