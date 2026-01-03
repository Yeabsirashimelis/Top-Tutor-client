"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, Filter, X } from "lucide-react";
import clsx from "clsx";

export interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  skillLevels: string[];
  languages: string[];
  minRating: number;
}

interface CourseFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availableCategories: string[];
  availableLanguages: string[];
}

export default function CourseFilters({
  filters,
  onFilterChange,
  availableCategories,
  availableLanguages,
}: CourseFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    level: true,
    language: true,
    rating: true,
  });

  const skillLevels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (range: [number, number]) => {
    onFilterChange({ ...filters, priceRange: range });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleSkillLevelToggle = (level: string) => {
    const newLevels = filters.skillLevels.includes(level)
      ? filters.skillLevels.filter((l) => l !== level)
      : [...filters.skillLevels, level];
    onFilterChange({ ...filters, skillLevels: newLevels });
  };

  const handleLanguageToggle = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter((l) => l !== language)
      : [...filters.languages, language];
    onFilterChange({ ...filters, languages: newLanguages });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ ...filters, minRating: rating });
  };

  const clearAllFilters = () => {
    onFilterChange({
      priceRange: [0, 10000],
      categories: [],
      skillLevels: [],
      languages: [],
      minRating: 0,
    });
  };

  const activeFilterCount =
    filters.categories.length +
    filters.skillLevels.length +
    filters.languages.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0);

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="lg:hidden mb-4 w-full sm:w-auto"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </Button>

      {/* Filter Panel */}
      <div
        className={clsx(
          "bg-white border rounded-lg p-4 space-y-4 relative z-10",
          "lg:block",
          isOpen ? "block" : "hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b">
          <h3 className="font-semibold text-lg flex items-center gap-2 text-black">
            <Filter className="w-5 h-5" />
            Filters
          </h3>
          {activeFilterCount > 0 && (
            <Button
              onClick={clearAllFilters}
              variant="ghost"
              size="sm"
              className="text-black hover:text-gray-700 font-semibold"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Price Range */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full text-left font-medium mb-2"
          >
            <span>Price Range</span>
            <ChevronDown
              className={clsx(
                "w-4 h-4 transition-transform",
                expandedSections.price && "rotate-180"
              )}
            />
          </button>
          {expandedSections.price && (
            <div className="space-y-2 mt-2">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    handlePriceChange([
                      Number(e.target.value),
                      filters.priceRange[1],
                    ])
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handlePriceChange([
                      filters.priceRange[0],
                      Number(e.target.value),
                    ])
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Max"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Free", range: [0, 0] as [number, number] },
                  { label: "Under $50", range: [0, 50] as [number, number] },
                  { label: "$50-$100", range: [50, 100] as [number, number] },
                  { label: "$100+", range: [100, 10000] as [number, number] },
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    onClick={() => handlePriceChange(preset.range)}
                    variant="outline"
                    size="sm"
                    className={clsx(
                      filters.priceRange[0] === preset.range[0] &&
                        filters.priceRange[1] === preset.range[1] &&
                        "bg-gray-800 text-white border-gray-800"
                    )}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full text-left font-medium mb-2"
          >
            <span>
              Category {filters.categories.length > 0 && `(${filters.categories.length})`}
            </span>
            <ChevronDown
              className={clsx(
                "w-4 h-4 transition-transform",
                expandedSections.category && "rotate-180"
              )}
            />
          </button>
          {expandedSections.category && (
            <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
              {availableCategories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                  />
                  <span className="text-sm text-black">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Skill Level */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection("level")}
            className="flex items-center justify-between w-full text-left font-medium mb-2"
          >
            <span>
              Skill Level {filters.skillLevels.length > 0 && `(${filters.skillLevels.length})`}
            </span>
            <ChevronDown
              className={clsx(
                "w-4 h-4 transition-transform",
                expandedSections.level && "rotate-180"
              )}
            />
          </button>
          {expandedSections.level && (
            <div className="space-y-2 mt-2">
              {skillLevels.map((level) => (
                <label
                  key={level}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.skillLevels.includes(level)}
                    onChange={() => handleSkillLevelToggle(level)}
                    className="rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                  />
                  <span className="text-sm text-black">{level}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Language */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection("language")}
            className="flex items-center justify-between w-full text-left font-medium mb-2"
          >
            <span>
              Language {filters.languages.length > 0 && `(${filters.languages.length})`}
            </span>
            <ChevronDown
              className={clsx(
                "w-4 h-4 transition-transform",
                expandedSections.language && "rotate-180"
              )}
            />
          </button>
          {expandedSections.language && (
            <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
              {availableLanguages.map((language) => (
                <label
                  key={language}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.languages.includes(language)}
                    onChange={() => handleLanguageToggle(language)}
                    className="rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                  />
                  <span className="text-sm text-black">{language}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="pb-2">
          <button
            onClick={() => toggleSection("rating")}
            className="flex items-center justify-between w-full text-left font-medium mb-2"
          >
            <span>Minimum Rating</span>
            <ChevronDown
              className={clsx(
                "w-4 h-4 transition-transform",
                expandedSections.rating && "rotate-180"
              )}
            />
          </button>
          {expandedSections.rating && (
            <div className="space-y-2 mt-2">
              {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="border-gray-300 text-gray-800 focus:ring-gray-800"
                  />
                  <span className="text-sm flex items-center gap-1 text-black">
                    <span className="text-yellow-500">★</span> {rating} & up
                  </span>
                </label>
              ))}
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === 0}
                  onChange={() => handleRatingChange(0)}
                  className="border-gray-300 text-gray-800 focus:ring-gray-800"
                />
                <span className="text-sm text-black">All ratings</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
