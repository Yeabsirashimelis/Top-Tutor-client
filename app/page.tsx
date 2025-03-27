// #007BFF or #3498DB

import HomeTop from "@/components/home/home-top";
import Navbar from "@/components/general/nav-bar";
import PopularCourses from "@/components/home/popular-courses";
import RightChoice from "@/components/home/right-choice";
import StatsHome from "@/components/home/stats-home-page";
import Testimonials from "@/components/home/testimonial";

export default function HomePage() {
  return (
    <div className="">
      <HomeTop />
      <StatsHome />
      <RightChoice />
      <PopularCourses />
      <Testimonials />
    </div>
  );
}
