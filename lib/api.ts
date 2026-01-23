import { betterFetch } from "@better-fetch/fetch";

/**
 * Centralized API configuration and helper functions
 */

// Base URL for all API calls
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_LINK;

// API endpoint builders
export const endpoints = {
  // Courses
  courses: {
    list: () => `${API_BASE_URL}/api/courses`,
    get: (courseId: string) => `${API_BASE_URL}/api/courses/${courseId}`,
    challenges: (courseId: string, userId: string) =>
      `${API_BASE_URL}/api/courses/${courseId}/challenges?userId=${userId}`,
  },

  // Course Progress
  courseProgress: {
    get: (userId: string, courseId?: string) => {
      const url = new URL(`${API_BASE_URL}/api/course-progress`);
      url.searchParams.set("userId", userId);
      if (courseId) url.searchParams.set("courseId", courseId);
      return url.toString();
    },
    update: () => `${API_BASE_URL}/api/course-progress`,
  },

  // Gamification
  gamification: {
    profile: (userId: string) =>
      `${API_BASE_URL}/api/gamification?userId=${userId}`,
    awardPoints: () => `${API_BASE_URL}/api/gamification`,
    streak: () => `${API_BASE_URL}/api/gamification/streak`,
    badges: (userId?: string) => {
      const base = `${API_BASE_URL}/api/gamification/badges`;
      return userId ? `${base}?userId=${userId}` : base;
    },
    awardBadge: () => `${API_BASE_URL}/api/gamification/badges`,
    leaderboard: (limit: number, timeframe: string, courseId?: string) => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        timeframe,
      });
      if (courseId) params.append("courseId", courseId);
      return `${API_BASE_URL}/api/gamification/leaderboard?${params.toString()}`;
    },
    userRank: (userId: string, timeframe: string) =>
      `${API_BASE_URL}/api/gamification/leaderboard/rank?userId=${userId}&timeframe=${timeframe}`,
    challenges: (userId: string, date: string) =>
      `${API_BASE_URL}/api/gamification/challenges?userId=${userId}&date=${date}`,
    completeChallenge: () =>
      `${API_BASE_URL}/api/gamification/challenges/complete`,
  },

  // Quizzes
  quizzes: {
    get: (quizId: string, courseId: string, userId?: string) => {
      const url = new URL(`${API_BASE_URL}/api/quizzes/${quizId}`);
      url.searchParams.set("courseId", courseId);
      if (userId) url.searchParams.set("userId", userId);
      return url.toString();
    },
    submitAttempt: (courseId: string, quizId: string) =>
      `${API_BASE_URL}/api/courses/${courseId}/quizzes/${quizId}/attempt`,
  },

  // Lecture Progress
  lectureProgress: {
    update: (courseId: string, lectureId: string) =>
      `${API_BASE_URL}/api/courses/${courseId}/lectures/${lectureId}/progress`,
  },

  // Ratings
  ratings: {
    get: (courseId: string, userId: string) =>
      `${API_BASE_URL}/api/course-rating/${courseId}/${userId}`,
    create: () => `${API_BASE_URL}/api/course-rating`,
  },

  // User
  user: {
    syncAuth: () => `${API_BASE_URL}/api/users/sync-auth`,
  },

  // Recently Viewed
  recentlyViewed: {
    track: () => `${API_BASE_URL}/api/recently-viewed`,
  },

  // Wishlist
  wishlist: {
    get: (userId: string) => `${API_BASE_URL}/api/wishlist/${userId}`,
    toggle: () => `${API_BASE_URL}/api/wishlist`,
  },

  // Payment
  payment: {
    status: (courseId: string, userId: string) =>
      `${API_BASE_URL}/api/payment-status/${courseId}/${userId}`,
    submit: () => `${API_BASE_URL}/api/payments`,
  },

  // Course Access
  courseAccess: {
    check: (courseId: string, userId: string) =>
      `${API_BASE_URL}/api/course-access/${courseId}/${userId}`,
  },

  // Notes
  notes: {
    list: (userId: string, courseId: string) =>
      `${API_BASE_URL}/api/notes?userId=${userId}&courseId=${courseId}`,
    create: () => `${API_BASE_URL}/api/notes`,
    update: (noteId: string) => `${API_BASE_URL}/api/notes/${noteId}`,
    delete: (noteId: string) => `${API_BASE_URL}/api/notes/${noteId}`,
  },
} as const;

// Type-safe API fetcher with automatic error handling
export async function apiFetch<T>(
  url: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
  }
): Promise<T | undefined> {
  const res = await betterFetch<T>(url, {
    method: options?.method,
    body: options?.body ? JSON.stringify(options.body) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  return res.data ?? undefined;
}
