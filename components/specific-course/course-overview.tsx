import { Button } from "@/components/ui/button";
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

export default function CourseOverview() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">About This Course</h3>
        <p>
          Learn React from the ground up and build modern, interactive web
          applications with this comprehensive course. Master the fundamentals
          of React, including components, props, state, and hooks, and gain the
          skills to create professional-grade applications.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              <span>Duration</span>
            </div>
            <p className="text-sm text-muted-foreground">12 hours</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <BarChart3 className="h-4 w-4" />
              <span>Skill Level</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Beginner to Intermediate
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              <span>Lectures</span>
            </div>
            <p className="text-sm text-muted-foreground">45 lectures</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe className="h-4 w-4" />
              <span>Language</span>
            </div>
            <p className="text-sm text-muted-foreground">English</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">What You'll Learn</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          <li className="flex gap-2">
            <ThumbsUp className="h-5 w-5 text-green-500 shrink-0" />
            <span>
              Build modern React applications using functional components
            </span>
          </li>
          <li className="flex gap-2">
            <ThumbsUp className="h-5 w-5 text-green-500 shrink-0" />
            <span>
              Master React Hooks for state management and side effects
            </span>
          </li>
          <li className="flex gap-2">
            <ThumbsUp className="h-5 w-5 text-green-500 shrink-0" />
            <span>Create reusable components with proper props and state</span>
          </li>
          <li className="flex gap-2">
            <ThumbsUp className="h-5 w-5 text-green-500 shrink-0" />
            <span>Implement routing with React Router</span>
          </li>
          <li className="flex gap-2">
            <ThumbsUp className="h-5 w-5 text-green-500 shrink-0" />
            <span>
              Connect React applications to APIs and external services
            </span>
          </li>
          <li className="flex gap-2">
            <ThumbsUp className="h-5 w-5 text-green-500 shrink-0" />
            <span>Deploy your applications to production environments</span>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Instructor</h3>
        <div className="flex gap-4">
          <img
            src="/images/man"
            alt="Instructor"
            className="rounded-full h-16 w-16 object-cover"
          />
          <div>
            <h4 className="font-medium">Amanuel Sisay</h4>
            <p className="text-sm text-muted-foreground">
              Senior React Developer & Educator
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                4.8 Instructor Rating
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>25,000+ Reviews</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                <span>120,000+ Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button className="w-full sm:w-auto bg-indigo-600">
          Download Course Materials
        </Button>
      </div>
    </div>
  );
}
