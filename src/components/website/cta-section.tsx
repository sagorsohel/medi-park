"use client";

import { Button } from "@/components/ui/button";
import { useGetCTASectionPublicQuery } from "@/services/homepageApi";
import { motion, type Variants } from "framer-motion";

export function CTASection() {
  const { data } = useGetCTASectionPublicQuery();
  const section = data?.data;

  // Only render if we have cached data
  if (!section) return null;

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const textVariants: Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full bg-primary py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {/* Left Side - Text */}
          <motion.div
            className="text-white"
            variants={textVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {section.title || "Ask Medipark"}
            </h2>
            {/* {section.sub_title && (
              <p className="text-lg text-blue-200 mb-2">
                {section.sub_title}
              </p>
            )} */}
            {section.content && (
              <p className="text-base text-blue-100">
                {section.content}
              </p>
            )}
          </motion.div>

          {/* Right Side - Button */}
          <motion.div variants={buttonVariants}>
            <Button
              className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-[40px] whitespace-nowrap"
              onClick={() => {
                if (section.button_link) {
                  window.location.href = section.button_link;
                }
              }}
            >
              {section.button_text || "Send Query"}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

