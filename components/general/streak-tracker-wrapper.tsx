"use client";

import { useDailyStreak } from "@/hooks/use-daily-streak";

/**
 * Client component wrapper to handle daily streak tracking
 * This needs to be a separate client component since we're using hooks
 */
export default function StreakTrackerWrapper() {
  useDailyStreak();
  return null;
}
