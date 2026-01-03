"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PlayCircle, Clock, Eye } from "lucide-react";

export default function SampleVideos() {
  const videos = [
    {
      src: "/videos/v-1.mp4",
      title: "Freshman Mathematics Sample Videos",
      description: "Learn the basics of maths in this introductory tutorial",
      duration: "12:30",
      views: "2.5K"
    },
    {
      src: "/videos/v-2.mp4",
      title: "Freshman Geography Course",
      description: "Learn geography and take your skills to the next level",
      duration: "15:45",
      views: "3.2K"
    },
    {
      src: "/videos/v-3.mp4",
      title: "Freshman Psychology Course",
      description: "Learn the basics of human psychology",
      duration: "18:20",
      views: "4.1K"
    }
  ];

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/30 to-green-50/30" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-green-300/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-[95%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <PlayCircle className="w-8 h-8 text-emerald-600" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Sample Tutorial Videos
            </h2>
          </div>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Get a preview of our high-quality course content
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden border-2 border-emerald-100/50 hover:border-emerald-300 transition-all duration-500 bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-emerald-500/20">
                <CardContent className="p-0">
                  {/* Video Container */}
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100">
                    <video
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      controls
                      preload="metadata"
                      poster="/placeholder.svg?height=480&width=640"
                    >
                      <source src={video.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Overlay with play button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
                      >
                        <PlayCircle className="w-10 h-10 text-white" />
                      </motion.div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {video.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-emerald-100/50">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Eye className="w-4 h-4" />
                        <span>{video.views} views</span>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold rounded-full cursor-pointer"
                      >
                        Watch Now
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">Want to see more?</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all"
          >
            Explore All Courses
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
