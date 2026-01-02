"use client";

import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useAddToWishlist, useRemoveFromWishlist, useGetWishlist } from "@/hooks/wishlist-hooks";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  courseId: string;
  className?: string;
  showLabel?: boolean;
}

export default function WishlistButton({ courseId, className = "", showLabel = false }: WishlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  const { data: wishlist } = useGetWishlist(userId);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isInWishlist = useMemo(() => {
    if (!wishlist || !courseId) return false;
    return wishlist.some((item: any) => item.course._id === courseId || item.courseId === courseId);
  }, [wishlist, courseId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      // Redirect to login if not authenticated
      router.push("/signin");
      return;
    }

    if (isInWishlist) {
      removeFromWishlist.mutate({ userId, courseId });
    } else {
      addToWishlist.mutate({ userId, courseId });
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={addToWishlist.isPending || removeFromWishlist.isPending}
      className={`
        flex items-center gap-2 transition-all duration-200
        ${isInWishlist 
          ? "text-red-500 hover:text-red-600" 
          : "text-gray-400 hover:text-red-500"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={`w-5 h-5 transition-all ${isInWishlist ? "fill-current" : ""}`}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        </span>
      )}
    </button>
  );
}
