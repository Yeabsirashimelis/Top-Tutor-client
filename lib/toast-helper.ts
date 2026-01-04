import toast from "react-hot-toast";
import { createElement } from "react";
import XPToast, { LevelUpToast } from "@/components/notifications/xp-toast";

export const showXPToast = (points: number, description: string, type?: "xp" | "level" | "streak" | "badge") => {
  toast.custom(
    (t) => createElement(XPToast, { points, description, type }),
    {
      duration: 3000,
      position: "top-right",
    }
  );
};

export const showLevelUpToast = (newLevel: number) => {
  toast.custom(
    (t) => createElement(LevelUpToast, { newLevel }),
    {
      duration: 5000,
      position: "top-center",
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
