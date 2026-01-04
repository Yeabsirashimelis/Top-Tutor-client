import { Zap, TrendingUp, Star, Award } from "lucide-react";

interface XPToastProps {
  points: number;
  description: string;
  type?: "xp" | "level" | "streak" | "badge";
}

export default function XPToast({ points, description, type = "xp" }: XPToastProps) {
  const getIcon = () => {
    switch (type) {
      case "level":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "streak":
        return <Star className="w-5 h-5 text-orange-500" />;
      case "badge":
        return <Award className="w-5 h-5 text-purple-500" />;
      default:
        return <Zap className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "level":
        return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "streak":
        return "bg-gradient-to-r from-orange-500 to-red-500";
      case "badge":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      default:
        return "bg-gradient-to-r from-yellow-500 to-amber-500";
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg shadow-lg p-4 border-l-4 border-indigo-500">
      <div className={`${getBgColor()} p-2 rounded-full`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="font-bold text-gray-900">+{points} XP</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export function LevelUpToast({ newLevel }: { newLevel: number }) {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-4">
      <div className="bg-white/20 p-2 rounded-full">
        <TrendingUp className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-white text-lg">Level Up!</p>
        <p className="text-sm text-indigo-100">You reached Level {newLevel}</p>
      </div>
      <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{newLevel}</span>
      </div>
    </div>
  );
}
