"use client";

import { useGetAllCourseChallenges } from "@/hooks/daily-challenges-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  CheckCircle, 
  BookOpen, 
  Trophy, 
  Clock, 
  Zap,
  Sparkles 
} from "lucide-react";

interface DailyChallengesProps {
  userId: string;
  courseIds?: string[]; // Array of enrolled course IDs
}

const getChallengeIcon = (type: string) => {
  switch (type) {
    case "complete_lecture":
      return <BookOpen className="w-5 h-5" />;
    case "pass_quiz":
      return <Trophy className="w-5 h-5" />;
    case "study_time":
      return <Clock className="w-5 h-5" />;
    case "perfect_quiz":
      return <Sparkles className="w-5 h-5" />;
    case "complete_section":
      return <Target className="w-5 h-5" />;
    default:
      return <Zap className="w-5 h-5" />;
  }
};

export default function DailyChallenges({ userId, courseIds }: DailyChallengesProps) {
  console.log("🎨 [DAILY CHALLENGES COMPONENT] Rendering with:", {
    userId,
    courseIds,
    courseCount: courseIds?.length || 0
  });
  
  const { data, isLoading, error } = useGetAllCourseChallenges(userId, courseIds);
  
  console.log("🎨 [DAILY CHALLENGES COMPONENT] Hook state:", {
    isLoading,
    hasError: !!error,
    error,
    dataLength: Array.isArray(data) ? data.length : 0,
    data
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Daily Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Daily Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              No challenges available today. Enroll in courses to see challenges!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Flatten all challenges from all courses
  const allChallenges: any[] = [];
  data.forEach((courseData: any) => {
    if (courseData?.challenges) {
      courseData.challenges.forEach((challenge: any) => {
        const progress = courseData.userProgress?.find(
          (p: any) => p.challengeId === challenge._id
        );
        allChallenges.push({
          ...challenge,
          courseId: courseData.courseId,
          userProgress: progress,
        });
      });
    }
  });

  const totalChallenges = allChallenges.reduce(
    (sum, c) => sum + c.challenges.length,
    0
  );
  const completedChallenges = allChallenges.reduce((sum, c) => {
    const completed = c.userProgress?.challenges.filter((ch: any) => ch.completed).length || 0;
    return sum + completed;
  }, 0);
  const completionPercentage = totalChallenges > 0 
    ? Math.round((completedChallenges / totalChallenges) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Daily Challenges
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {completedChallenges}/{totalChallenges}
            </span>
            {completedChallenges === totalChallenges && totalChallenges > 0 && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                All Complete! 🎉
              </span>
            )}
          </div>
        </div>
        <div className="mt-3">
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allChallenges.map((courseChallenge, courseIndex) => (
            <div key={courseIndex}>
              {courseChallenge.challenges.map((challengeItem: any, index: number) => {
                const progress = courseChallenge.userProgress?.challenges.find(
                  (p: any) => p.type === challengeItem.type
                );
                const isCompleted = progress?.completed || false;
                const currentProgress = progress?.progress || 0;
                const progressPercentage = challengeItem.target > 0
                  ? Math.min((currentProgress / challengeItem.target) * 100, 100)
                  : 0;

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isCompleted
                        ? "bg-green-50 border-green-300"
                        : "bg-gray-50 border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-indigo-100 text-indigo-600"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          getChallengeIcon(challengeItem.type)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p
                            className={`font-medium text-sm ${
                              isCompleted ? "text-green-900 line-through" : "text-gray-900"
                            }`}
                          >
                            {challengeItem.description}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold text-sm text-yellow-700">
                              +{challengeItem.points}
                            </span>
                          </div>
                        </div>
                        
                        {!isCompleted && (
                          <div>
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>
                                {currentProgress} / {challengeItem.target}
                              </span>
                              <span>{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 rounded-full h-2 transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {isCompleted && (
                          <p className="text-xs text-green-600 font-medium">
                            ✓ Completed
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {completedChallenges === totalChallenges && totalChallenges > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
            <p className="text-center text-sm font-semibold text-indigo-900">
              🎉 Amazing! You've completed all daily challenges!
            </p>
            <p className="text-center text-xs text-indigo-600 mt-1">
              Come back tomorrow for new challenges
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
