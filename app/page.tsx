// #007BFF or #3498DB

import HomeTop from "@/components/home/home-top";
import PopularCourses from "@/components/home/popular-courses";
import RightChoice from "@/components/home/right-choice";
import StatsHome from "@/components/home/stats-home-page";
import Testimonials from "@/components/home/testimonial";
import SampleVideos from "@/components/home/sample-videos";
import TrendingCourses from "@/components/home/trending-courses";
import RecentlyViewed from "@/components/home/recently-viewed";

export default function HomePage() {
  return (
    <div className="">
      <HomeTop />
      <StatsHome />
      <RecentlyViewed />
      <TrendingCourses />
      <RightChoice />
      <PopularCourses />
      <SampleVideos />
      <Testimonials />
    </div>
  );
}
