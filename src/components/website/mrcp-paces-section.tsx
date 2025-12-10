"use client";

import { useGetMRCPPACESActiveQuery } from "@/services/aboutPageApi";
import { motion, type Variants } from "framer-motion";

export function MRCPPACESSection() {
  const { data } = useGetMRCPPACESActiveQuery();
  const section = data?.["2nd_after_our_vision_section"];

  // Only render if we have cached data
  if (!section) {
    return null;
  }

  // Animation variants
  const imageVariants: Variants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const contentVariants: Variants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const titleVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "easeOut",
      },
    },
  };

  const textVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-start">
          {/* Right Side - Large Image */}
          <motion.div
            className="flex justify-center gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageVariants}
          >
            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 w-full max-w-lg">
              <img
                src={section.image}
                alt={section.title || "MRCP PACES"}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
            </div>
          </motion.div>
          {/* Left Side - Title and Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={contentVariants}
          >
            {/* Subtitle */}
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 md:mb-8 text-left"
              variants={titleVariants}
            >
              {section.title}
            </motion.h2>

            {/* Descriptive Paragraph */}
            <motion.div
              className="max-w-full"
              variants={textVariants}
            >
              <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
                {section.paragraph}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

