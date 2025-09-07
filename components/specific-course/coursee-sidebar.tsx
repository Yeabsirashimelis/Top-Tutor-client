"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Search,
  Download,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourseProgress } from "@/hooks/course-progress-hooks";
import { formatDuration } from "@/utils/format-duration";

interface Lecture {
  _id: string;
  title: string;
  lectureDuration?: number;
  resources?: any[];
}

interface Section {
  _id: string;
  title: string;
  lectures: Lecture[];
}

interface CourseSidebarProps {
  sections: Section[];
  currentLecture?: { sectionId: string; lectureId: string } | null;
  setCurrentLecture: (val: { sectionId: string; lectureId: string }) => void;
  courseId: string;
  userId?: string;
}

export default function CourseSidebar({
  sections,
  currentLecture,
  setCurrentLecture,
  courseId,
  userId,
}: CourseSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    sections.length ? [sections[0]._id] : []
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Get course progress
  const { data: progress } = useCourseProgress(userId!, courseId);

  const getSectionDuration = (section: Section) => {
    const totalHours = section.lectures.reduce(
      (sum, lecture) => sum + (lecture.lectureDuration || 0),
      0
    );
    return totalHours;
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getLectureProgress = (lectureId: string) => {
    if (!progress?.lecturesProgress) return null;
    return progress.lecturesProgress.find(
      (lp: any) => lp.lecture === lectureId
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search lectures"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {sections
          .filter(
            (s) =>
              s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.lectures.some((l) =>
                l.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
          )
          .map((section) => (
            <div key={section._id} className="border-b">
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto font-medium"
                onClick={() => toggleSection(section._id)}
              >
                <span className="text-left flex items-center justify-between w-full">
                  {section.title}
                  <span className="font-bold text-black">
                    {formatDuration(getSectionDuration(section))}
                  </span>
                </span>

                {expandedSections.includes(section._id) ? (
                  <ChevronUp className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                )}
              </Button>

              {expandedSections.includes(section._id) && (
                <div className="px-4 pb-2">
                  {section.lectures.map((lecture) => {
                    const isCurrent = currentLecture?.lectureId === lecture._id;
                    const lectureProg = getLectureProgress(lecture._id);
                    const isCompleted = lectureProg?.isCompleted;

                    return (
                      <div
                        key={lecture._id}
                        className={cn(
                          "flex items-start gap-2 p-2 text-sm rounded-md hover:bg-muted cursor-pointer",
                          isCurrent && "bg-muted"
                        )}
                        onClick={() =>
                          setCurrentLecture({
                            sectionId: section._id,
                            lectureId: lecture._id,
                          })
                        }
                      >
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{lecture.title}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDuration(lecture.lectureDuration) ||
                                "0:00"}
                            </span>
                            {lecture.resources?.length ? (
                              <>
                                <Download className="h-3 w-3 ml-1" />
                                <span>Downloadable</span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
