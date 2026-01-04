import { useEffect } from "react";
import { useUpdateStreak } from "./gamification-hooks";
import { useSession } from "next-auth/react";

/**
 * Hook to automatically track daily login streak
 * Call this in the root layout or main app component
 */
export function useDailyStreak() {
  const { data: session } = useSession();
  const { mutate: updateStreak } = useUpdateStreak();

  useEffect(() => {
    if (!session?.user?.id) return;

    // Check if we've already updated streak today
    const lastStreakUpdate = localStorage.getItem("lastStreakUpdate");
    const today = new Date().toDateString();

    if (lastStreakUpdate !== today) {
      // Update streak on server
      updateStreak(
        { userId: session.user.id },
        {
          onSuccess: () => {
            // Mark as updated for today
            localStorage.setItem("lastStreakUpdate", today);
          },
          onError: (error) => {
            console.error("Failed to update streak:", error);
          },
        }
      );
    }
  }, [session?.user?.id, updateStreak]);
}
