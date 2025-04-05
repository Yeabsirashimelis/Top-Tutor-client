import CourseHeader from "@/components/specific-course/course-header";
import CourseNotes from "@/components/specific-course/course-note";
import CourseOverview from "@/components/specific-course/course-overview";
import CoursePlayer from "@/components/specific-course/course-player";
import CourseSidebar from "@/components/specific-course/coursee-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function CoursePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <CourseHeader />
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-3/4 flex-1">
          <CoursePlayer />
          <div className="p-4 md:p-6">
            <Tabs defaultValue="notes" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="notes"
                  className={cn(
                    "transition-colors",
                    "data-[state=active]:bg-indigo-600 data-[state=active]:text-gray-300"
                  )}
                >
                  Notes
                </TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              <TabsContent value="notes" className="mt-4">
                <CourseNotes />
              </TabsContent>
              <TabsContent value="overview" className="mt-4">
                <CourseOverview />
              </TabsContent>
              <TabsContent value="resources" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Course Resources</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-blue-600 hover:underline">
                      <a href="#" className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-file"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        Course Slides.pdf
                      </a>
                    </li>
                    <li className="flex items-center gap-2 text-blue-600 hover:underline">
                      <a href="#" className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-file"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        Exercise Files.zip
                      </a>
                    </li>
                    <li className="flex items-center gap-2 text-blue-600 hover:underline">
                      <a href="#" className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-link"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        Additional Resources
                      </a>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="w-full lg:w-1/4 border-l">
          <CourseSidebar />
        </div>
      </div>
    </div>
  );
}
