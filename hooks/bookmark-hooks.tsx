import { betterFetch } from "@better-fetch/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Bookmark {
  _id: string;
  userId: string;
  lectureId: string;
  courseId: string;
  timestamp: number;
  note?: string;
  createdAt: Date;
}

// Get bookmarks for a lecture or course
export const getBookmarks = async (
  userId: string,
  lectureId?: string,
  courseId?: string
) => {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/bookmarks?userId=${userId}`;
  if (lectureId) url += `&lectureId=${lectureId}`;
  if (courseId) url += `&courseId=${courseId}`;

  const res = await betterFetch<{ bookmarks: Bookmark[] }>(url);
  return res.data?.bookmarks || [];
};

export const useGetBookmarks = (
  userId?: string,
  lectureId?: string,
  courseId?: string
) => {
  return useQuery({
    queryKey: ["bookmarks", userId, lectureId, courseId],
    queryFn: () => getBookmarks(userId!, lectureId, courseId),
    enabled: !!userId,
  });
};

// Add a bookmark
export const useAddBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      lectureId,
      courseId,
      timestamp,
      note,
    }: {
      userId: string;
      lectureId: string;
      courseId: string;
      timestamp: number;
      note?: string;
    }) => {
      const res = await betterFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/bookmarks`,
        {
          method: "POST",
          body: JSON.stringify({ userId, lectureId, courseId, timestamp, note }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bookmarks", variables.userId],
      });
    },
  });
};

// Remove a bookmark
export const useRemoveBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookmarkId, userId }: { bookmarkId: string; userId: string }) => {
      const res = await betterFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/bookmarks`,
        {
          method: "DELETE",
          body: JSON.stringify({ bookmarkId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["bookmarks", variables.userId],
      });
    },
  });
};
