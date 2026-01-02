"use client";

import { useMemo, useState } from "react";
import { useGetCourses } from "@/hooks/course-hooks";
import CourseCard from "../home/course-card";
import Spinner from "../spinner";
import Search from "./Search";
import CourseFilters, { FilterOptions } from "./course-filters";
import CourseSort, { SortOption } from "./course-sort";
import { Course } from "@/types/types";

export default function CourseList() {
  const { data: courses, isPending: isLoadingCourses } = useGetCourses();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    categories: [],
    skillLevels: [],
    languages: [],
    minRating: 0,
  });

  // Extract unique values for filters
  const { availableCategories, availableLanguages } = useMemo(() => {
    if (!courses) return { availableCategories: [], availableLanguages: [] };

    const categories = new Set<string>();
    const languages = new Set<string>();

    courses.forEach((course) => {
      if (course.courseType) categories.add(course.courseType);
      if (course.language) languages.add(course.language);
    });

    return {
      availableCategories: Array.from(categories).sort(),
      availableLanguages: Array.from(languages).sort(),
    };
  }, [courses]);

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    let result = [...courses];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.courseType.toLowerCase().includes(query) ||
          (course.instructor &&
            typeof course.instructor !== "string" &&
            course.instructor.name.toLowerCase().includes(query))
      );
    }

    // Price filter
    result = result.filter(
      (course) =>
        course.price >= filters.priceRange[0] &&
        course.price <= filters.priceRange[1]
    );

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((course) =>
        filters.categories.includes(course.courseType)
      );
    }

    // Skill level filter
    if (filters.skillLevels.length > 0) {
      result = result.filter((course) =>
        filters.skillLevels.includes(course.skillLevel)
      );
    }

    // Language filter
    if (filters.languages.length > 0) {
      result = result.filter((course) =>
        filters.languages.includes(course.language)
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter(
        (course) =>
          course.ratingsAverage && course.ratingsAverage >= filters.minRating
      );
    }

    return result;
  }, [courses, searchQuery, filters]);

  // Sort courses
  const sortedCourses = useMemo(() => {
    const result = [...filteredCourses];

    switch (sortBy) {
      case "popular":
        return result.sort((a, b) => {
          const aPopularity = (a.ratingsQuantity || 0) * (a.ratingsAverage || 0);
          const bPopularity = (b.ratingsQuantity || 0) * (b.ratingsAverage || 0);
          return bPopularity - aPopularity;
        });
      case "newest":
        return result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
      case "highest-rated":
        return result.sort(
          (a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0)
        );
      case "price-low-high":
        return result.sort((a, b) => a.price - b.price);
      case "price-high-low":
        return result.sort((a, b) => b.price - a.price);
      case "title-asc":
        return result.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return result.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return result;
    }
  }, [filteredCourses, sortBy]);

  if (isLoadingCourses) {
    return <Spinner loading={isLoadingCourses} />;
  }

  return (
    <div className="mt-8">
      <div className="w-[95%] mx-auto px-4 py-3">
        {/* Search Bar */}
        <Search
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <CourseFilters
              filters={filters}
              onFilterChange={setFilters}
              availableCategories={availableCategories}
              availableLanguages={availableLanguages}
            />
          </aside>

          {/* Courses Grid */}
          <main className="flex-1">
            {/* Header with results count and sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 tracking-tight">
                  {searchQuery
                    ? `Search Results for "${searchQuery}"`
                    : "All Courses"}
                </h2>
                <p className="text-gray-600 mt-1">
                  {sortedCourses.length} course{sortedCourses.length !== 1 ? "s" : ""}{" "}
                  found
                </p>
              </div>
              <CourseSort value={sortBy} onChange={setSortBy} />
            </div>

            {/* Courses Grid */}
            {sortedCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedCourses.map((course) => (
                  <CourseCard {...course} key={course._id} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-24 h-24 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No courses found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({
                      priceRange: [0, 10000],
                      categories: [],
                      skillLevels: [],
                      languages: [],
                      minRating: 0,
                    });
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
