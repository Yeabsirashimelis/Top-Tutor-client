"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import clsx from "clsx";
import { SearchIcon, X } from "lucide-react";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export default function Search({ value, onChange, onClear }: SearchProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyVisible(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.01,
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <>
      <div ref={ref} className="my-8 relative">
        <div className="relative w-full max-w-3xl">
          <Input
            type="text"
            placeholder="Search for courses, topics, or instructors..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-base px-4 pr-12 py-6 border-2 rounded-2xl shadow-md border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-800 transition duration-200 text-black placeholder:text-gray-500 bg-white"
          />
          <div className="absolute inset-y-0 right-4 flex items-center gap-2">
            {value && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <SearchIcon className="text-gray-800 w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Sticky version shown when scrolled out */}
      <div
        className={clsx(
          "sticky top-16 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-gray-300 shadow-lg",
          isStickyVisible ? "block" : "hidden"
        )}
      >
        <div className="w-[95%] mx-auto py-4 relative">
          <div className="w-full max-w-3xl relative">
            <Input
              type="text"
              placeholder="Search for courses, topics, or instructors..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full max-w-3xl text-base px-4 py-6 border-2 rounded-2xl shadow-md border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-800 transition duration-200 text-black placeholder:text-gray-500 bg-white"
            />
            <div className="absolute inset-y-0 right-4 flex items-center gap-2">
              {value && (
                <button
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 transition"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <SearchIcon className="text-gray-800 w-7 h-7" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
