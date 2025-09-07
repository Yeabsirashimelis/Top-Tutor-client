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
  const userId = session?.user?.id;

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
    <div className="border rounded-md p-4 space-y-4">
      <h3 className="text-lg font-medium">Complete Your Payment</h3>
      <p className="text-sm text-muted-foreground">
        Please transfer the course fee to our account and upload your payment
        receipt below.
      </p>

      <Input
        type="number"
        placeholder="Enter amount paid"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <FileUploadButton
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        buttonText="Upload Receipt"
      />

      {receiptUrl && (
        <div className="mt-2">
          <p className="text-sm">Receipt uploaded:</p>
          <img
            src={receiptUrl}
            alt="Receipt"
            className="w-40 h-auto rounded border"
          />
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-indigo-600"
      >
        {submitting ? "Submitting..." : "Submit Payment"}
      </Button>
    </div>
  );
}
