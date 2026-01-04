"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUploadButton from "../file-upload-button";
import { useSubmitPayment } from "@/hooks/payment-hooks";
import { useSession } from "next-auth/react";

interface PaymentFormProps {
  courseId: string;
}

export default function PaymentForm({ courseId }: PaymentFormProps) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [amount, setAmount] = useState("");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  // Use the hook-only mutation
  const { mutate: submitPayment, isPending: submitting } = useSubmitPayment();

  const handleUploadComplete = (res: { url: string; key: string }[]) => {
    if (res.length > 0) setReceiptUrl(res[0].url);
  };

  const handleUploadError = (error: Error) => {
    console.error("Upload error:", error);
    alert("Upload failed. Try again.");
  };

  const handleSubmit = () => {
    if (!amount || !receiptUrl) {
      alert("Please enter amount and upload receipt.");
      return;
    }

    submitPayment(
      {
        userId,
        courseId,
        amount: Number(amount),
        receiptImage: receiptUrl,
      },
      {
        onSuccess: (data) => {
          // Open the success page in a new tab
          window.open(`/courses/${courseId}`, "_blank");
        },
        onError: (error: any) => {
          alert(error?.message || "Payment failed. Try again.");
        },
      }
    );
  };

  return (
    <div className="border rounded-lg p-6 space-y-6 bg-white shadow-sm">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Complete Your Payment</h3>
        <p className="text-sm text-gray-600 mt-1">
          Please transfer the course fee to our account and upload your payment
          receipt below.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Amount Paid <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          placeholder="Enter amount paid"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <FileUploadButton
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          buttonText="Payment Receipt *"
        />
      </div>

      {receiptUrl && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-green-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Receipt uploaded successfully</p>
              <div className="mt-3">
                <img
                  src={receiptUrl}
                  alt="Payment Receipt"
                  className="max-w-xs h-auto rounded-lg border-2 border-green-300 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={submitting || !amount || !receiptUrl}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting Payment...
          </span>
        ) : (
          "Submit Payment"
        )}
      </Button>
    </div>
  );
}
