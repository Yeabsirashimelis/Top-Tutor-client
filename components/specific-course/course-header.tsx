import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Share2 } from "lucide-react";
import Link from "next/link";

export default function CourseHeader() {
  return (
    <div className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/courses">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back to dashboard</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">
              React for Beginners: Build Modern Web Applications
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Section 3: React Hooks</span>
              <span>•</span>
              <span>Lecture 12: useState Hook</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-sm text-muted-foreground">
            <span className="font-medium">42% complete</span>
          </div>
          <Progress
            value={42}
            className="w-20 md:w-40 h-2 
          [&>[data-state='complete']]:bg-indigo-600
          "
          />
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
