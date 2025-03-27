"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function RightChoice() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="lg:grid mt-12 lg:grid-cols-2  lg:h-[600px]" ref={ref}>
      <motion.div
        className="relative w-full h-[400px] lg:h-[600px]"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/images/girl-photo2"
          alt="Home Photo"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
      </motion.div>

      <motion.div
        className="bg-indigo-600 px-8 py-12 lg:px-12 lg:py-16 lg:h-[600px] text-gray-50 lg:flex lg:items-center lg:justify-center"
        initial={{ opacity: 0, x: -100 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="text-center lg:text-left lg:w-1/2">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl lg:text-3xl font-bold"
          >
            TOP TUTOR AND MENTOR
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="sm:text-4xl text-3xl md:text-4xl mt-2"
          >
            FEEL LIKE WE ARE THE RIGHT PLACE FOR YOU TO STUDY?
          </motion.p>
          <Link href="contact-us">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-6 border-2 text-lg 
              border-black w-full px-4 py-2 hover:bg-black
              hover:text-gray-50 hover:scale-105 font-bold transition-all duration-400"
            >
              Start Learning
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default RightChoice;
