import toast from "react-hot-toast";
import { createElement } from "react";
import XPToast, { LevelUpToast } from "@/components/notifications/xp-toast";

export type XPToastType = "xp" | "level" | "streak" | "badge";

export const showXPToast = (
  points: number,
  description: string,
  type: XPToastType = "xp"
) => {
  toast.custom(
    () => createElement(XPToast, { points, description, type }),
    {
      duration: 3000,
      position: "top-right",
      id: `xp-toast-${Date.now()}`, // Unique ID to prevent duplicates
    }
  );
};

export const showLevelUpToast = (newLevel: number) => {
  toast.custom(
    () => createElement(LevelUpToast, { newLevel }),
    {
      duration: 5000,
      position: "top-center",
      id: `level-up-${newLevel}`,
    }
  );
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: "top-right",
  });
};

// Dismiss a specific toast by ID
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};
