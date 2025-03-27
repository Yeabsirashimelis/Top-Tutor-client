"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Emily Carter",
    occupation: "Computer Science Student at AAU",
    text: "This platform has made learning so much easier! The interactive lessons and recorded lectures help me revise anytime. My professor even recommended it!",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    rating: 5,
  },
  {
    name: "Daniel Adams",
    occupation: "Mechanical Engineering Student at ASTU",
    text: "I used to struggle with some concepts, but the quizzes and discussion forums have really helped me understand better. My instructor loved how engaged we became!",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    rating: 4,
  },
  {
    name: "Sophia Lee",
    occupation: "Business Administration Student",
    text: "The structured courses and easy access to materials are amazing. Our professor was so happy to see students actively participating in discussions!",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    rating: 5,
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <div className="py-12 px-4 md:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-indigo-600 mb-2">
          Testimonials
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          See what our customers have to say about our products and services
        </p>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Card */}
        <Card className="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>

          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row gap-8 items-center"
              >
                {/* Left side - Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-indigo-600 blur-md opacity-20 scale-110"></div>
                    <Avatar className="w-24 h-24 border-4 border-indigo-100">
                      <AvatarImage
                        src={testimonials[index].image}
                        alt={testimonials[index].name}
                      />
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                        {testimonials[index].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Rating */}
                  <div className="flex justify-center md:justify-start mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonials[index].rating
                            ? "fill-indigo-500 text-indigo-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-gray-700 italic mb-4">
                    "{testimonials[index].text}"
                  </blockquote>

                  {/* Author */}
                  <div>
                    <h4 className="font-bold text-indigo-900">
                      {testimonials[index].name}
                    </h4>
                    <p className="text-sm text-indigo-600">
                      {testimonials[index].occupation}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>

        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === index ? "bg-indigo-600 scale-125" : "bg-indigo-200"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
