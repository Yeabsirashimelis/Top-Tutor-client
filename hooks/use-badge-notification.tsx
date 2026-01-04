import { create } from "zustand";

interface Badge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  rarity: string;
  points: number;
}

interface BadgeNotificationStore {
  badges: Badge[];
  showBadges: (badges: Badge[]) => void;
  clearBadges: () => void;
}

export const useBadgeNotification = create<BadgeNotificationStore>((set) => ({
  badges: [],
  showBadges: (badges) => set({ badges }),
  clearBadges: () => set({ badges: [] }),
}));
