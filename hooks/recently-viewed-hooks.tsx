import { betterFetch } from "@better-fetch/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface RecentlyViewedItem {
  _id: string;
  userId: string;
  courseId: string;
  viewedAt: Date;
  course?: any;
}

// Get user's recently viewed courses
export const getRecentlyViewed = async (userId: string, limit: number = 10) => {
  const res = await betterFetch<{ recentlyViewed: RecentlyViewedItem[] }>(
    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/recently-viewed?userId=${userId}&limit=${limit}`
  );
  return res.data?.recentlyViewed || [];
};

export const useGetRecentlyViewed = (userId?: string, limit: number = 10) => {
  return useQuery({
    queryKey: ["recently-viewed", userId, limit],
    queryFn: () => getRecentlyViewed(userId!, limit),
    enabled: !!userId,
  });
};

// Track course view
export const useTrackCourseView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      courseId,
    }: {
      userId: string;
      courseId: string;
    }) => {
      const res = await betterFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/recently-viewed`,
        {
          method: "POST",
          body: JSON.stringify({ userId, courseId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recently-viewed", variables.userId] });
    },
  });
};
