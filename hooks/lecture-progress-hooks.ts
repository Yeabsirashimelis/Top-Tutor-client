import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAwardPoints, checkLevelUp } from "./gamification-hooks";
import { useBadgeNotification } from "./use-badge-notification";
import { showXPToast, showLevelUpToast } from "@/lib/toast-helper";
import { POINT_VALUES } from "@/types/gamification";

export interface LectureProgressUpdate {
  lectureId: string;
  lastPosition: number;
  isCompleted?: boolean;
}

export interface LectureProgressResponse {
  success: boolean;
  progress: {
    lectureId: string;
    lastPosition: number;
    isCompleted: boolean;
    completedAt?: Date;
  };
}

export function useLectureProgress(userId: string, courseId: string) {
  const queryClient = useQueryClient();
  const { mutateAsync: awardPoints } = useAwardPoints();
  const { showBadges } = useBadgeNotification();

  return useMutation({
    mutationFn: async (data: LectureProgressUpdate): Promise<LectureProgressResponse> => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/course-progress/${courseId}/lecture/${data.lectureId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            lastPosition: data.lastPosition,
            isCompleted: data.isCompleted,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update lecture progress");
      }

      return res.json();
    },
    onSuccess: async (data, variables) => {
      // Invalidate course progress query
      queryClient.invalidateQueries({
        queryKey: ["course-progress", userId, courseId],
      });

      // Award points when lecture is completed
      if (variables.isCompleted) {
        try {
          const result = await awardPoints({
            userId,
            points: POINT_VALUES.LECTURE_COMPLETED,
            type: "lecture_completed",
            description: "Completed a lecture",
            metadata: {
              courseId,
              lectureId: variables.lectureId,
            },
          });

          // Check if already completed (no duplicate points)
          if (result?.alreadyCompleted) {
            return;
          }

          // Show XP toast notification
          showXPToast(POINT_VALUES.LECTURE_COMPLETED, "Lecture completed!", "xp");

          // Check for level up using the helper
          const { leveledUp, newLevel } = checkLevelUp(result);
          if (leveledUp) {
            showLevelUpToast(newLevel);
          }

          // Show badge notifications if any badges were earned
          if (result?.newBadges && result.newBadges.length > 0) {
            showBadges(result.newBadges);
          }
        } catch (error) {
          // Silently fail - points are a bonus, not critical
        }
      }
    },
  });
}
