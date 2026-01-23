"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useGetCourse } from "@/hooks/course-hooks";
import { useCourseProgress } from "@/hooks/course-progress-hooks";
import { useCourseAccess } from "@/hooks/course-access-hooks";
import CourseHeader from "@/components/specific-course/course-header";
import CourseNotes from "@/components/specific-course/course-note";
import CourseOverview from "@/components/specific-course/course-overview";
import CourseSidebar from "@/components/specific-course/coursee-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useGetCourseRating } from "@/hooks/course-rating-hooks";
import Spinner from "@/components/spinner";
import { useGetPaymentStatus } from "@/hooks/payment-status-hooks";
import { useAwardPoints } from "@/hooks/gamification-hooks";
import { POINT_VALUES } from "@/types/gamification";

// Dynamic imports for heavy components to reduce initial bundle size
const CoursePlayer = dynamic(
  () => import("@/components/specific-course/course-player"),
  { loading: () => <div className="animate-pulse bg-gray-200 aspect-video w-full" /> }
);

const EnhancedQuizPlayer = dynamic(
  () => import("@/components/quiz/enhanced-quiz-player"),
  { loading: () => <div className="animate-pulse bg-gray-200 aspect-video w-full" /> }
);

const PaymentForm = dynamic(
  () => import("@/components/specific-course/paymentForm"),
  { loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" /> }
);

const RatingPrompt = dynamic(
  () => import("@/components/specific-course/rating-prompt"),
  { ssr: false }
);

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

  const { data: paymentStatus, isLoading: paymentStatusLoading } =
    useGetPaymentStatus(courseId! as string, userId);

  const { data: progress, refetch: refetchProgress } = useCourseProgress(
    userId!,
    courseId! as string,
    {
      enabled: !!access && !!userId,
    }
  );

  const { data: ratingData } = useGetCourseRating(courseId! as string, userId!);

  const [userRating, setUserRating] = useState<number | null>(null);
  const [userComment, setUserComment] = useState<string>("");
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<{
    quizId: string;
    sectionId: string;
  } | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<{
    quizId: string;
    sectionId: string;
  } | null>(null);

  const [currentLecture, setCurrentLecture] = useState<{
    sectionId: string;
    lectureId: string;
  } | null>(null);

  const [courseCompleted, setCourseCompleted] = useState(false);
  const [hasSeenCompletion, setHasSeenCompletion] = useState(false);
  const { mutateAsync: awardPoints } = useAwardPoints();

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
    
    const calculatedProgress = Math.round((completedCount / allLectures.length) * 100);
    
    // Once 100% is achieved, always show 100% (even if user goes back to review)
    return calculatedProgress === 100 ? 100 : calculatedProgress;
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

  // Check if course is completed when progress reaches 100%
  useEffect(() => {
    if (
      overallProgress === 100 &&
      allLectures.length > 0 &&
      !courseCompleted &&
      !activeQuiz &&
      !hasSeenCompletion
    ) {
      // Small delay to ensure UI updates
      const timer = setTimeout(async () => {
        setCourseCompleted(true);
        setHasSeenCompletion(true);
        
        // Award points for course completion
        if (userId) {
          try {
            const result = await awardPoints({
              userId,
              points: POINT_VALUES.COURSE_COMPLETED,
              type: "course_completed",
              description: `Completed course: ${course?.title}`,
              metadata: {
                courseId: courseId as string,
                courseName: course?.title,
                totalLectures: allLectures.length,
              },
            });
            
            // Points awarded (or already awarded if alreadyCompleted)
          } catch {
            // Silently fail - gamification is a bonus, not critical
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [overallProgress, allLectures.length, courseCompleted, activeQuiz, hasSeenCompletion, userId, courseId, course?.title, awardPoints]);

  // Track course view for recently viewed
  useEffect(() => {
    if (userId && courseId) {
      // Track view after a short delay to avoid tracking quick bounces
      const timer = setTimeout(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/recently-viewed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, courseId }),
        }).catch((err) => console.error("Failed to track view:", err));
      }, 3000); // Track after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [userId, courseId]);

  if (courseLoading || accessLoading) {
    return <Spinner loading={courseLoading} />;
  }
  if (courseError || !course) return <div>Error loading course</div>;

  if (!access) {
    // User has not been granted access yet
    if (paymentStatusLoading) return <Spinner loading={paymentStatusLoading} />;

    if (paymentStatus?.status === "pending") {
      return (
        <div className="p-6 max-w-4xl mx-auto space-y-6 bg-white min-h-screen">
          <CourseOverview course={course} access={access} />
          <div className="border rounded-md p-4 bg-yellow-50">
            <h3 className="text-lg font-medium text-yellow-800">
              Payment Pending
            </h3>
            <p className="text-sm text-yellow-700">
              We’ve received your payment receipt. An administrator will verify
              it shortly. You’ll be notified once your access is approved.
            </p>
          </div>
        </div>
      );
    }

    // No pending payment yet → show payment form
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6 bg-white min-h-screen">
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
    <div className="flex flex-col min-h-screen bg-white pt-16">
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
        course={course}
        showCompletionButton={overallProgress === 100 && hasSeenCompletion}
        onShowCompletion={() => setCourseCompleted(true)}
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
          {courseCompleted ? (
            <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-gray-50 to-white min-h-[500px]">
              <div className="text-center space-y-6 max-w-2xl">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-4xl font-bold text-black">
                  Congratulations!
                </h2>
                <p className="text-xl text-gray-700">
                  You've successfully completed{" "}
                  <span className="font-semibold">{course.title}</span>
                </p>
                <div className="bg-white border-2 border-gray-800 rounded-lg p-6 shadow-lg">
                  <p className="text-gray-600 mb-4">
                    You've mastered all {allLectures.length} lectures in this
                    course.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-lg font-semibold text-black">
                    <span>Course Progress:</span>
                    <span className="text-2xl">{overallProgress}%</span>
                  </div>
                </div>
                <div className="flex gap-4 justify-center mt-8">
                  <button
                    onClick={() => {
                      setCourseCompleted(false);
                      // Don't reset hasSeenCompletion so it won't auto-show again
                    }}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-all"
                  >
                    Review Lectures
                  </button>
                  {(!userRating || userRating === 0) && (
                    <button
                      onClick={() => setShowRatingPopup(true)}
                      className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-all"
                    >
                      Rate This Course
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : activeQuiz ? (
            <EnhancedQuizPlayer
              courseId={courseId! as string}
              quizId={activeQuiz.quizId}
              userId={userId!}
              onFinish={() => {
                setActiveQuiz(null);
                // Check if course is complete after quiz
                const currentIndex = allLectures.findIndex(
                  (l) => l._id === currentLecture?.lectureId
                );
                if (currentIndex === allLectures.length - 1) {
                  setCourseCompleted(true);
                }
              }}
            />
          ) : currentQuiz ? (
            <EnhancedQuizPlayer
              courseId={courseId! as string}
              quizId={currentQuiz.quizId}
              userId={userId!}
              onFinish={() => setCurrentQuiz(null)}
            />
          ) : (
            <CoursePlayer
              lecture={current}
              courseId={courseId! as string}
              onLectureComplete={() => {
                if (!currentLecture) return;

                const currentIndex = allLectures.findIndex(
                  (l) => l._id === currentLecture.lectureId
                );
                const nextLecture = allLectures[currentIndex + 1];

                const currentSectionId = currentLecture.sectionId;

                // Check if this was the last lecture
                const isLastLecture = currentIndex === allLectures.length - 1;

                // If there's a next lecture
                if (nextLecture) {
                  const isNextInSameSection =
                    nextLecture.sectionId === currentSectionId;

                  if (isNextInSameSection) {
                    // Continue to next lecture in the same section
                    setCurrentLecture({
                      sectionId: nextLecture.sectionId,
                      lectureId: nextLecture._id,
                    });
                  } else {
                    // End of section — check for a quiz before moving to next section
                    const sectionQuiz = course.quizzes?.find(
                      (q: any) => q.section === currentSectionId
                    );
                    if (sectionQuiz) {
                      setActiveQuiz({
                        quizId: sectionQuiz._id,
                        sectionId: sectionQuiz.section,
                      });
                    } else {
                      // No quiz → go to next section’s first lecture
                      setCurrentLecture({
                        sectionId: nextLecture.sectionId,
                        lectureId: nextLecture._id,
                      });
                    }
                  }
                } else {
                  // No more lectures at all — final section, check if there's a quiz
                  const sectionQuiz = course.quizzes?.find(
                    (q: any) => q.section === currentSectionId
                  );
                  if (sectionQuiz) {
                    setActiveQuiz({
                      quizId: sectionQuiz._id,
                      sectionId: sectionQuiz.section,
                    });
                  } else {
                    // No quiz and no more lectures - refetch progress and show completion
                    setTimeout(async () => {
                      await refetchProgress();
                      setCourseCompleted(true);
                    }, 1000);
                  }
                }
              }}
            />
          )}

          <div className="p-4 md:p-6 ">
            <Tabs defaultValue="notes" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger
                  value="notes"
                  className={cn(
                    "transition-colors text-gray-700",
                    "data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                  )}
                >
                  Notes
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="text-gray-700 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="text-gray-700 data-[state=active]:bg-gray-800 data-[state=active]:text-white"
                >
                  Resources
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="mt-4">
                <CourseNotes
                  userId={userId!}
                  courseId={courseId! as string}
                  sectionId={currentLecture?.sectionId || ""}
                  lectureId={currentLecture?.lectureId || ""}
                  allLectures={allLectures}
                  onSelectLecture={(sectionId, lectureId) => {
                    setCurrentLecture({ sectionId, lectureId });
                    setCourseCompleted(false); // Hide completion screen when selecting from notes
                  }}
                />
              </TabsContent>

              <TabsContent value="overview" className="mt-4">
                <CourseOverview course={course} access={access} />
              </TabsContent>

              <TabsContent value="resources" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-black">
                    Course Resources
                  </h3>
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
            quizzes={course.quizzes}
            currentLecture={currentLecture}
            currentQuiz={currentQuiz}
            setCurrentLecture={(lecture) => {
              setCurrentLecture(lecture);
              setCourseCompleted(false); // Hide completion screen when selecting a lecture
            }}
            setCurrentQuiz={(quiz) => {
              setCurrentQuiz(quiz);
              setCourseCompleted(false); // Hide completion screen when selecting a quiz
            }}
            courseId={courseId! as string}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
}
