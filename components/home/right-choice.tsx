"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, ArrowRight, CheckCircle, Users } from "lucide-react";

function RightChoice() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const features = [
    "Expert Instructors",
    "Interactive Learning",
    "Flexible Schedule",
    "Certified Programs"
  ];

  return (
    <section className="relative w-full overflow-hidden" ref={ref}>
      <div className="lg:grid lg:grid-cols-2 lg:min-h-[600px]">
        {/* Image Section */}
        <motion.div
          className="relative w-full h-[400px] lg:h-[700px] overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0">
            <Image
              src="/images/girl-photo2"
              alt="Student Learning"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 scale-110 group-hover:scale-100 transition-transform duration-700"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-indigo-800/40 to-transparent" />
          </div>

          {/* Floating stats card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl max-w-xs"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-8 py-16 lg:px-16 lg:py-20 text-white flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl" />
          </div>

          {/* Decorative pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:24px_24px] opacity-30" />

          <div className="relative z-10 max-w-lg">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30"
            >
              <GraduationCap className="w-5 h-5" />
              <span className="text-sm font-semibold">Premium Learning Platform</span>
            </motion.div>

            {/* Main heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Ready to Transform Your{" "}
              <span className="text-blue-100">Future?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-blue-50 mb-8 leading-relaxed"
            >
              Join our community of learners and unlock your potential with expert-led courses and personalized mentorship.
            </motion.p>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-blue-200 flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <Link href="/courses">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full sm:w-auto px-8 py-4 bg-white text-blue-700 font-bold text-lg rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Learning Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>

            {/* Trust badge */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6 text-sm text-blue-100 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Trusted by 10,000+ students worldwide
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default RightChoice;
