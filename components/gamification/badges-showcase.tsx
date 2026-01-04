"use client";

import { useGetBadges } from "@/hooks/gamification-hooks";
import { useGetGamificationProfile } from "@/hooks/gamification-hooks";
import { Award, Lock, Star, TrendingUp, Zap, Target, Trophy, Flame, Brain, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface BadgesShowcaseProps {
  userId: string;
}

const getBadgeIcon = (iconName: string) => {
  const icons: any = {
    star: Star,
    trophy: Trophy,
    flame: Flame,
    zap: Zap,
    target: Target,
    brain: Brain,
    heart: Heart,
    award: Award,
  };
  const IconComponent = icons[iconName] || Award;
  return IconComponent;
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return "from-yellow-400 to-orange-500";
    case "epic":
      return "from-purple-400 to-pink-500";
    case "rare":
      return "from-blue-400 to-indigo-500";
    default:
      return "from-gray-400 to-gray-500";
  }
};

export default function BadgesShowcase({ userId }: BadgesShowcaseProps) {
  const { data, isLoading } = useGetBadges(userId);
  const { data: gamificationData } = useGetGamificationProfile(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const badges = data?.badges || [];
  const userBadges = data?.userBadges || [];
  const earnedBadgeIds = new Set(userBadges.map((b: any) => b.badgeId));
  const profile = gamificationData?.profile;

  // Calculate progress towards badges
  const getBadgeProgress = (badge: any) => {
    if (!profile) return { current: 0, target: 0, percentage: 0 };
    
    try {
      const criteria = typeof badge.criteria === 'string' ? JSON.parse(badge.criteria) : badge.criteria;
      let current = 0;
      let target = criteria.count || criteria.days || 0;
      
      switch (criteria.type) {
        case 'lectures_completed':
          current = profile.totalLecturesCompleted || 0;
          break;
        case 'quizzes_passed':
          current = profile.totalQuizzesPassed || 0;
          break;
        case 'courses_completed':
          current = profile.totalCoursesCompleted || 0;
          break;
        case 'level':
          current = profile.level || 0;
          break;
        case 'streak':
          current = profile.currentStreak || 0;
          break;
        default:
          return { current: 0, target: 0, percentage: 0 };
      }
      
      const percentage = Math.min((current / target) * 100, 100);
      return { current, target, percentage };
    } catch (error) {
      return { current: 0, target: 0, percentage: 0 };
    }
  };

  // Calculate completion percentage safely
  const completionPercentage = badges.length > 0 
    ? Math.round((userBadges.length / badges.length) * 100) 
    : 0;

  // Group badges by category
  const categories = ["learning", "achievement", "streak", "social", "special"];
  const groupedBadges = categories.reduce((acc: any, category) => {
    acc[category] = badges.filter((b: any) => b.category === category);
    return acc;
  }, {});

  // Show message if no badges exist in the system
  if (badges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Badges & Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Badges Available Yet
            </h3>
            <p className="text-gray-500">
              Badges will be available soon. Keep learning and checking back!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Badges & Achievements</h2>
          <p className="text-gray-600 mt-1">
            {userBadges.length} of {badges.length} earned
          </p>
        </div>
        <div className="bg-indigo-100 px-4 py-2 rounded-full">
          <span className="text-indigo-700 font-semibold">
            {completionPercentage}% Complete
          </span>
        </div>
      </div>

      {Object.entries(groupedBadges).map(([category, categoryBadges]: [string, any]) => {
        if (categoryBadges.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize flex items-center gap-2">
                <Award className="w-5 h-5" />
                {category} Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categoryBadges.map((badge: any) => {
                  const isEarned = earnedBadgeIds.has(badge.badgeId);
                  const earnedBadge = userBadges.find((b: any) => b.badgeId === badge.badgeId);
                  const IconComponent = getBadgeIcon(badge.icon || "award");
                  const progress = !isEarned ? getBadgeProgress(badge) : null;

                  return (
                    <div
                      key={badge.badgeId}
                      className={`relative group ${
                        isEarned ? "cursor-pointer" : ""
                      }`}
                    >
                      <div
                        className={`
                          aspect-square rounded-xl p-4 flex flex-col items-center justify-center
                          bg-gradient-to-br ${getRarityColor(badge.rarity)}
                          ${isEarned ? "shadow-lg hover:scale-105" : "grayscale opacity-70"}
                          transition-all duration-200 relative overflow-hidden
                        `}
                      >
                        {isEarned ? (
                          <IconComponent className="w-12 h-12 text-white mb-2" />
                        ) : (
                          <Lock className="w-12 h-12 text-white mb-2" />
                        )}
                        <p className="text-white text-center text-xs font-medium">
                          {badge.name}
                        </p>
                        {badge.points > 0 && (
                          <p className="text-white/80 text-xs mt-1">
                            +{badge.points} XP
                          </p>
                        )}
                        
                        {/* Progress bar for locked badges */}
                        {!isEarned && progress && progress.target > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white text-xs">
                                {progress.current}/{progress.target}
                              </span>
                              <span className="text-white text-xs">
                                {Math.round(progress.percentage)}%
                              </span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-1.5">
                              <div
                                className="bg-white rounded-full h-1.5 transition-all duration-300"
                                style={{ width: `${progress.percentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <p className="font-semibold mb-1">{badge.name}</p>
                        <p className="text-gray-300 text-xs mb-2">{badge.description}</p>
                        
                        {/* Show progress in tooltip */}
                        {!isEarned && progress && progress.target > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-700">
                            <p className="text-gray-400 text-xs mb-1">
                              Progress: {progress.current} / {progress.target}
                            </p>
                            <Progress value={progress.percentage} className="h-2" />
                          </div>
                        )}
                        
                        {isEarned && earnedBadge && (
                          <p className="text-gray-400 text-xs mt-2 pt-2 border-t border-gray-700">
                            Earned on {new Date(earnedBadge.earnedAt).toLocaleDateString()}
                          </p>
                        )}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
