"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import clsx from "clsx";
import { SearchCheck, SearchIcon } from "lucide-react";

export default function Search() {
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

  return (
    <>
      <div ref={ref} className="my-8 relative">
        <div className="relative w-full max-w-3xl">
          <Input
            type="text"
            placeholder="Search for anything"
            className="w-full text-base px-4 pr-12 py-6 border rounded-2xl shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <SearchIcon className="text-indigo-600 w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Sticky version shown when scrolled out */}
      <div
        className={clsx(
          "sticky top-16 z-30 bg-indigo-50 border-t border-b border-gray-100 shadow-sm",
          isStickyVisible ? "block" : "hidden"
        )}
      >
        <div className="w-[95%] mx-auto py-4 relative">
          <div className="w-full max-w-3xl relative">
            <Input
              type="text"
              placeholder="Search for anything"
              className="w-full max-w-3xl text-base px-4 py-6 border rounded-2xl shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <SearchIcon className="text-indigo-600 w-7 h-7" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
