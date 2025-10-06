import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetPaymentStatus(courseId: string, userId?: string) {
  return useQuery({
    queryKey: ["payment-status", courseId, userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/payments/status?courseId=${courseId}&userId=${userId}`
      );
      return data.payment; // returns {status: "pending"|"approved"|"rejected"}
    },
    enabled: !!courseId && !!userId,
  });
}
