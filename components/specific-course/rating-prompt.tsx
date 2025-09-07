"use client";

import StarRatings from "@/utils/star-ratings";
import { useState, useEffect } from "react";
import { useRateCourse } from "@/hooks/course-rating-hooks";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RatingPromptProps {
  overallProgress: number;
  initialRating?: number | null;
  initialComment?: string;
  courseId: string;
  userId: string;
  showPopup?: boolean;
  setShowPopup?: (open: boolean) => void;
  onAfterSubmit?: (rating: number, comment?: string) => void;
  ratingLoaded?: boolean;
}

export default function RatingPrompt({
  overallProgress,
  initialRating = null,
  initialComment = "",
  courseId,
  userId,
  showPopup: controlledShowPopup,
  setShowPopup: setControlledShowPopup,
  onAfterSubmit,
  ratingLoaded = false,
}: RatingPromptProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rateCourseMutation = useRateCourse();

  // Determine if we're using controlled or uncontrolled state
  const isControlled = controlledShowPopup !== undefined;
  const actualShowPopup = isControlled ? controlledShowPopup : showPopup;

  // Sync internal state with controlled prop
  useEffect(() => {
    if (isControlled && controlledShowPopup !== undefined) {
      setShowPopup(controlledShowPopup);
    }
  }, [isControlled, controlledShowPopup]);

  // Auto-show popup when conditions are met
  useEffect(() => {
    if (
      ratingLoaded &&
      userRating === null &&
      !actualShowPopup &&
      overallProgress >= 20
    ) {
      if (isControlled && setControlledShowPopup) {
        setControlledShowPopup(true);
      } else {
        setShowPopup(true);
      }
    }
  }, [
    ratingLoaded,
    userRating,
    actualShowPopup,
    overallProgress,
    isControlled,
    setControlledShowPopup,
  ]);

  const handleClose = () => {
    if (isControlled && setControlledShowPopup) {
      setControlledShowPopup(false);
    } else {
      setShowPopup(false);
    }
  };

  const handleSubmit = () => {
    if (userRating === null) return;

    setIsSubmitting(true);

    rateCourseMutation.mutate(
      { courseId, userId, rating: userRating, reviewText: comment },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          handleClose();
          if (onAfterSubmit) onAfterSubmit(userRating, comment);
        },
        onError: (err) => {
          console.error("Failed to submit rating:", err);
          setIsSubmitting(false);
        },
      }
    );
  };

  if (!actualShowPopup) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Rate this course
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <StarRatings
              maxRating={5}
              defaultRating={userRating || 0}
              onSetRating={setUserRating}
              size={40}
              color="#facc15"
            />
          </div>

          <textarea
            placeholder="Share your experience with this course... (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />

          <div className="mt-6 flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || userRating === null}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
