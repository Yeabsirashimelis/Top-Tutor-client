import { create } from "zustand";
import type { Badge, BadgeRarity } from "@/types/gamification";

// Badge for notification display (can come from API or be constructed)
export interface NotificationBadge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  points: number;
}

interface BadgeNotificationStore {
  badges: NotificationBadge[];
  showBadges: (badges: NotificationBadge[] | Badge[]) => void;
  clearBadges: () => void;
  dismissBadge: (badgeId: string) => void;
}

export const useBadgeNotification = create<BadgeNotificationStore>((set) => ({
  badges: [],
  showBadges: (badges) =>
    set({
      badges: badges.map((b) => ({
        badgeId: b.badgeId || (b as Badge)._id,
        name: b.name,
        description: b.description,
        icon: b.icon,
        rarity: b.rarity,
        points: b.points,
      })),
    }),
  clearBadges: () => set({ badges: [] }),
  dismissBadge: (badgeId) =>
    set((state) => ({
      badges: state.badges.filter((b) => b.badgeId !== badgeId),
    })),
}));
