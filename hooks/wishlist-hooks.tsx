import { betterFetch } from "@better-fetch/fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface WishlistItem {
  _id: string;
  userId: string;
  courseId: string;
  addedAt: Date;
}

// Get user's wishlist
export const getWishlist = async (userId: string) => {
  const res = await betterFetch<{ wishlist: WishlistItem[] }>(
    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/wishlist?userId=${userId}`
  );
  return res.data?.wishlist || [];
};

export const useGetWishlist = (userId?: string) => {
  return useQuery({
    queryKey: ["wishlist", userId],
    queryFn: () => getWishlist(userId!),
    enabled: !!userId,
  });
};

// Add course to wishlist
export const useAddToWishlist = () => {
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
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/wishlist`,
        {
          method: "POST",
          body: JSON.stringify({ userId, courseId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", variables.userId] });
    },
  });
};

// Remove course from wishlist
export const useRemoveFromWishlist = () => {
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
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/wishlist`,
        {
          method: "DELETE",
          body: JSON.stringify({ userId, courseId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", variables.userId] });
    },
  });
};

// Check if course is in wishlist
export const useIsInWishlist = (userId?: string, courseId?: string) => {
  const { data: wishlist } = useGetWishlist(userId);
  
  if (!wishlist || !courseId) return false;
  
  return wishlist.some((item) => item.courseId === courseId);
};
