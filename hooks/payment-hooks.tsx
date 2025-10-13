import { betterFetch } from "@better-fetch/fetch";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface PaymentPayload {
  userId?: string;
  courseId?: string;
  collectionId?: string;
  amount: number;
  receiptImage: string;
}

export interface PaymentResponse {
  success: boolean;
  payment?: any;
  message?: string;
}

// Hook to submit payment (mutation)
export const useSubmitPayment = () => {
  return useMutation({
    mutationFn: async (payload: PaymentPayload) => {
      const res = await betterFetch<PaymentResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/payments`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Payment failed");
      }

      return res.data;
    },
  });
};

// Example hook to fetch user's payments (query)
export const useGetPayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await betterFetch<{ message: string; payments: any[] }>(
        "/api/payments/user"
      );
      return res.data?.payments || [];
    },
  });
};
