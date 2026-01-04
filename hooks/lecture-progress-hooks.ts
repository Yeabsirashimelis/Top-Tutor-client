import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAwardPoints } from "./gamification-hooks";
import { useBadgeNotification } from "./use-badge-notification";
import { showXPToast, showLevelUpToast } from "@/lib/toast-helper";

export function useLectureProgress(userId: string, courseId: string) {
  const queryClient = useQueryClient();
  const { mutateAsync: awardPoints } = useAwardPoints();
  const { showBadges } = useBadgeNotification();

  return useMutation({
    mutationFn: async (data: {
      lectureId: string;
      lastPosition: number;
      isCompleted?: boolean;
    }) => {
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
      queryClient.invalidateQueries({
        queryKey: ["course-progress", userId, courseId],
      });

      // Award points when lecture is completed
      if (variables.isCompleted) {
        console.log("📚 [LECTURE] Lecture completed, awarding points:", {
          userId,
          courseId,
          lectureId: variables.lectureId
        });
        try {
          const result = await awardPoints({
            userId,
            points: 10,
            type: "lecture_completed",
            description: "Completed a lecture",
            metadata: {
              courseId,
              lectureId: variables.lectureId,
            },
          });
          console.log("✅ [LECTURE] Points awarded for lecture completion");
          
          // Show XP toast notification
          showXPToast(10, "Lecture completed!", "xp");
          
          // Check for level up
          if (result?.profile) {
            const currentLevel = result.profile.level;
            const previousLevel = localStorage.getItem(`user_level_${userId}`);
            
            if (previousLevel && parseInt(previousLevel) < currentLevel) {
              showLevelUpToast(currentLevel);
            }
            
            localStorage.setItem(`user_level_${userId}`, currentLevel.toString());
          }
          
          // Show badge notifications if any badges were earned
          if (result?.newBadges && result.newBadges.length > 0) {
            console.log("🏆 [LECTURE] Badges earned:", result.newBadges);
            showBadges(result.newBadges);
          }
        } catch (error) {
          console.error("❌ [LECTURE] Failed to award points for lecture completion:", error);
        }
      }
    },
  });
}
