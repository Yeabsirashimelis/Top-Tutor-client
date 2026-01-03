"use client";

import { Button } from "../ui/button";
import { ArrowUpDown, Check } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export type SortOption =
  | "popular"
  | "newest"
  | "highest-rated"
  | "price-low-high"
  | "price-high-low"
  | "title-asc"
  | "title-desc";

interface CourseSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function CourseSort({ value, onChange }: CourseSortProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest First" },
    { value: "highest-rated", label: "Highest Rated" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "title-asc", label: "Title: A to Z" },
    { value: "title-desc", label: "Title: Z to A" },
  ];

  const currentLabel = sortOptions.find((opt) => opt.value === value)?.label;

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ArrowUpDown className="w-4 h-4" />
        <span className="hidden sm:inline">Sort by:</span>
        <span className="font-medium">{currentLabel}</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg z-20 min-w-[200px] py-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  "w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center justify-between text-black",
                  value === option.value && "bg-gray-800 text-white font-semibold"
                )}
              >
                <span>{option.label}</span>
                {value === option.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
