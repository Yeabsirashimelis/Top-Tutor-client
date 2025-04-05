"use client";

import { useState } from "react";
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

// Mock course data
const courseSections = [
  {
    id: 1,
    title: "Introduction to the Course",
    lectures: [
      {
        id: 1,
        title: "Welcome to the Course",
        duration: "5:12",
        completed: true,
      },
      { id: 2, title: "Course Overview", duration: "8:45", completed: true },
      {
        id: 3,
        title: "Setting Up Your Environment",
        duration: "12:20",
        completed: true,
      },
    ],
  },
  {
    id: 2,
    title: "React Fundamentals",
    lectures: [
      { id: 4, title: "What is React?", duration: "10:15", completed: true },
      {
        id: 5,
        title: "Creating Your First Component",
        duration: "15:30",
        completed: true,
      },
      { id: 6, title: "Props and State", duration: "18:45", completed: false },
    ],
  },
  {
    id: 3,
    title: "React Hooks",
    lectures: [
      {
        id: 7,
        title: "Introduction to Hooks",
        duration: "8:30",
        completed: false,
      },
      {
        id: 8,
        title: "useState Hook",
        duration: "14:20",
        completed: false,
        current: true,
      },
      { id: 9, title: "useEffect Hook", duration: "16:40", completed: false },
      { id: 10, title: "useContext Hook", duration: "12:15", completed: false },
      { id: 11, title: "useRef Hook", duration: "9:50", completed: false },
    ],
  },
  {
    id: 4,
    title: "Building a Complete Application",
    lectures: [
      { id: 12, title: "Project Setup", duration: "7:25", completed: false },
      { id: 13, title: "Creating the UI", duration: "22:10", completed: false },
      {
        id: 14,
        title: "Adding Functionality",
        duration: "25:40",
        completed: false,
      },
      {
        id: 15,
        title: "Testing and Deployment",
        duration: "18:30",
        completed: false,
      },
    ],
  },
];

export default function CourseSidebar() {
  const [expandedSections, setExpandedSections] = useState<number[]>([3]); // Section 3 expanded by default
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
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
        {courseSections.map((section) => (
          <div key={section.id} className="border-b">
            <Button
              variant="ghost"
              className="w-full justify-between p-4 h-auto font-medium"
              onClick={() => toggleSection(section.id)}
            >
              <span className="text-left">{section.title}</span>
              {expandedSections.includes(section.id) ? (
                <ChevronUp className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0" />
              )}
            </Button>

            {expandedSections.includes(section.id) && (
              <div className="px-4 pb-2">
                {section.lectures.map((lecture) => (
                  <div
                    key={lecture.id}
                    className={cn(
                      "flex items-start gap-2 p-2 text-sm rounded-md hover:bg-muted cursor-pointer",
                      lecture.current && "bg-muted"
                    )}
                  >
                    <div className="mt-0.5">
                      {lecture.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{lecture.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{lecture.duration}</span>
                        {lecture.id % 3 === 0 && (
                          <>
                            <Download className="h-3 w-3 ml-1" />
                            <span>Downloadable</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
