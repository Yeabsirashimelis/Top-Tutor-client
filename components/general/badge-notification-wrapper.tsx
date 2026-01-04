"use client";

import { useBadgeNotification } from "@/hooks/use-badge-notification";
import BadgeNotification from "@/components/gamification/badge-notification";

/**
 * Global wrapper for badge notifications
 * Add this to the root layout to show badge notifications anywhere in the app
 */
export default function BadgeNotificationWrapper() {
  const { badges, clearBadges } = useBadgeNotification();

  return <BadgeNotification badges={badges} onClose={clearBadges} />;
}
