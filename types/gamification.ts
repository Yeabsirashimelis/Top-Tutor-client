// Gamification Types - Centralized type definitions

// ============ Points & Transactions ============
export interface PointTransaction {
  _id: string;
  user: string;
  points: number;
  type: PointTransactionType;
  description: string;
  metadata?: PointTransactionMetadata;
  createdAt: Date;
}

export type PointTransactionType =
  | "lecture_completed"
  | "quiz_passed"
  | "quiz_perfect"
  | "course_completed"
  | "streak_bonus"
  | "daily_challenge"
  | "badge_earned"
  | "first_login"
  | "profile_complete";

export interface PointTransactionMetadata {
  courseId?: string;
  lectureId?: string;
  quizId?: string;
  score?: number;
  badgeId?: string;
  [key: string]: unknown;
}

// ============ Point Values (Configurable) ============
export const POINT_VALUES = {
  LECTURE_COMPLETED: 10,
  QUIZ_PASSED: 20,
  QUIZ_PERFECT: 50,
  COURSE_COMPLETED: 100,
  STREAK_BONUS_7_DAYS: 50,
  STREAK_BONUS_30_DAYS: 200,
  DAILY_CHALLENGE: 25,
} as const;

// ============ User Profile ============
export interface UserGamificationProfile {
  _id: string;
  user: string;
  totalPoints: number;
  level: number;
  currentLevelPoints: number;
  pointsToNextLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakFreezeAvailable?: boolean;
  badges: UserBadge[];
  totalLecturesCompleted: number;
  totalQuizzesPassed: number;
  totalCoursesCompleted: number;
  totalStudyTimeMinutes: number;
}

export interface UserBadge {
  badgeId: string;
  earnedAt: Date;
  progress: number;
}

// ============ Badges ============
export interface Badge {
  _id: string;
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  category: BadgeCategory;
  points: number;
  criteria: BadgeCriteria;
}

export type BadgeRarity = "common" | "rare" | "epic" | "legendary";
export type BadgeCategory = "learning" | "achievement" | "streak" | "social" | "special";

export interface BadgeCriteria {
  type: "lectures_completed" | "quizzes_passed" | "courses_completed" | "level" | "streak" | "points";
  count?: number;
  days?: number;
}

// Unified rarity colors used across badge-notification and badges-showcase
export const RARITY_GRADIENTS: Record<BadgeRarity, string> = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-500",
};

export const RARITY_BORDERS: Record<BadgeRarity, string> = {
  common: "border-gray-400",
  rare: "border-blue-400",
  epic: "border-purple-400",
  legendary: "border-yellow-400",
};

export const RARITY_BG_COLORS: Record<BadgeRarity, string> = {
  common: "bg-gray-100 text-gray-700",
  rare: "bg-blue-100 text-blue-700",
  epic: "bg-purple-100 text-purple-700",
  legendary: "bg-yellow-100 text-yellow-700",
};

// ============ Daily Challenges ============
export type ChallengeType =
  | "complete_lecture"
  | "pass_quiz"
  | "study_time"
  | "perfect_quiz"
  | "complete_section";

export interface ChallengeItem {
  type: ChallengeType;
  target: number;
  points: number;
  description: string;
}

export interface DailyChallenge {
  _id: string;
  date: Date;
  courseId?: string;
  challenges: ChallengeItem[];
}

export interface UserChallengeProgress {
  _id: string;
  user: string;
  date: Date;
  courseId?: string;
  challenges: {
    type: ChallengeType;
    completed: boolean;
    progress: number;
    target: number;
  }[];
}

// ============ Leaderboard ============
export interface LeaderboardEntry {
  rank: number;
  oderId: string;
  userName: string;
  userAvatar?: string;
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  badges: number;
  totalLecturesCompleted: number;
  totalQuizzesPassed: number;
  totalCoursesCompleted: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total: number;
  timeframe: "all-time" | "monthly" | "weekly";
  userRank?: number;
}

// ============ API Responses ============
export interface AwardPointsResponse {
  success: boolean;
  profile: UserGamificationProfile;
  transaction: PointTransaction;
  newBadges?: Badge[];
  leveledUp?: boolean;
  previousLevel?: number;
  alreadyCompleted?: boolean;
}

export interface GamificationProfileResponse {
  profile: UserGamificationProfile;
  recentTransactions: PointTransaction[];
}

export interface BadgesResponse {
  badges: Badge[];
  userBadges: UserBadge[];
}

export interface DailyChallengesResponse {
  challenges: DailyChallenge[];
  userProgress: UserChallengeProgress[];
}

// Legacy single challenge response (for backward compatibility)
export interface LegacyDailyChallengeResponse {
  challenge: DailyChallenge;
  userProgress: UserChallengeProgress;
}
