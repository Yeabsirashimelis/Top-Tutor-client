"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGetCourse } from "@/hooks/course-hooks";
import { useCourseProgress } from "@/hooks/course-progress-hooks";
import { useCourseAccess } from "@/hooks/course-access-hooks";
import CourseHeader from "@/components/specific-course/course-header";
import CourseNotes from "@/components/specific-course/course-note";
import CourseOverview from "@/components/specific-course/course-overview";
import CoursePlayer from "@/components/specific-course/course-player";
import CourseSidebar from "@/components/specific-course/coursee-sidebar";
import PaymentForm from "@/components/specific-course/paymentForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import RatingPrompt from "@/components/specific-course/rating-prompt";
import { useGetCourseRating } from "@/hooks/course-rating-hooks";

export default function CoursePage() {
  const { courseId } = useParams();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useGetCourse(courseId! as string);
  const { data: access, isLoading: accessLoading } = useCourseAccess(
    courseId! as string,
    userId
  );
  const { data: progress } = useCourseProgress(userId!, courseId! as string, {
    enabled: !!access && !!userId,
  });

  const { data: ratingData } = useGetCourseRating(courseId! as string, userId!);
  console.log(ratingData);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userComment, setUserComment] = useState<string>("");
  const [showRatingPopup, setShowRatingPopup] = useState(false);

  const [currentLecture, setCurrentLecture] = useState<{
    sectionId: string;
    lectureId: string;
  } | null>(null);

  const allLectures = useMemo(
    () =>
      (course?.sections || []).flatMap((section) =>
        section.lectures.map((lecture) => ({
          ...lecture,
          sectionId: section._id,
        }))
      ),
    [course]
  );

  useEffect(() => {
    if (!progress || currentLecture || !allLectures.length) return;

    const firstIncomplete = allLectures.find((lecture) => {
      const lp = progress?.lecturesProgress?.find(
        (p: any) => p.lecture === lecture._id
      );
      return !lp?.isCompleted;
    });

    setCurrentLecture(
      firstIncomplete
        ? {
            sectionId: firstIncomplete.sectionId,
            lectureId: firstIncomplete._id,
          }
        : { sectionId: allLectures[0].sectionId, lectureId: allLectures[0]._id }
    );
  }, [progress, allLectures, currentLecture]);

  const overallProgress = useMemo(() => {
    if (!allLectures.length) return 0;
    const completedCount = allLectures.filter((lecture) => {
      const lp = progress?.lecturesProgress?.find(
        (p: any) => p.lecture === lecture._id
      );
      return lp?.isCompleted === true;
    }).length;
    return Math.round((completedCount / allLectures.length) * 100);
  }, [progress, allLectures]);

  useEffect(() => {
    if (ratingData) {
      setUserRating(ratingData.rating || null);
      setUserComment(ratingData.reviewText || "");
    }
  }, [ratingData]);

  useEffect(() => {
    if (overallProgress >= 20 && ratingData && ratingData.rating == null) {
      setShowRatingPopup(true);
    }
  }, [overallProgress, ratingData]);

  if (courseLoading || accessLoading) return <div>Loading course...</div>;
  if (courseError || !course) return <div>Error loading course</div>;

  if (!access) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <CourseOverview course={course} access={access} />
        <PaymentForm courseId={courseId! as string} />
      </div>
    );
  }

  const sections = course.sections || [];
  const current = currentLecture
    ? allLectures.find((l) => l._id === currentLecture.lectureId)
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <CourseHeader
        courseTitle={course.title}
        currentSection={
          current
            ? sections.find((s) => s._id === current.sectionId)?.title
            : ""
        }
        currentLecture={current?.title || ""}
        overallProgress={overallProgress}
        userRating={userRating}
        userComment={userComment}
        onRateClick={() => setShowRatingPopup(true)}
      />
      <RatingPrompt
        overallProgress={overallProgress}
        initialComment={userComment}
        initialRating={userRating}
        courseId={courseId! as string}
        userId={userId!}
        showPopup={showRatingPopup}
        setShowPopup={setShowRatingPopup}
        onAfterSubmit={(rating, comment) => {
          setUserRating(rating);
          setUserComment(comment || "");
        }}
        ratingLoaded={!!ratingData}
      />
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-3/4 flex-1">
          <CoursePlayer
            lecture={current}
            courseId={courseId! as string}
            goToNextLecture={() => {
              if (!currentLecture) return;
              const currentIndex = allLectures.findIndex(
                (l) => l._id === currentLecture.lectureId
              );
              const nextLecture = allLectures[currentIndex + 1];
              if (nextLecture)
                setCurrentLecture({
                  sectionId: nextLecture.sectionId,
                  lectureId: nextLecture._id,
                });
            }}
          />

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
                <CourseNotes
                  userId={userId!}
                  courseId={courseId! as string}
                  sectionId={currentLecture?.sectionId || ""}
                  lectureId={currentLecture?.lectureId || ""}
                  allLectures={allLectures}
                  onSelectLecture={(sectionId, lectureId) =>
                    setCurrentLecture({ sectionId, lectureId })
                  }
                />
              </TabsContent>

              <TabsContent value="overview" className="mt-4">
                <CourseOverview course={course} access={access} />
              </TabsContent>

              <TabsContent value="resources" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Course Resources</h3>
                  <ul className="space-y-2">
                    {course.resources?.map((r: any) => (
                      <li
                        key={r.url}
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <a href={r.url} className="flex items-center gap-2">
                          {r.type === "file" ? "📄" : "🔗"} {r.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="w-full lg:w-1/4 border-l">
          <CourseSidebar
            sections={sections}
            currentLecture={currentLecture}
            setCurrentLecture={setCurrentLecture}
            courseId={courseId! as string}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
}
