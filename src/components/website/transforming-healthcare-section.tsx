"use client";

import { useGetTransformingHealthcareActiveQuery } from "@/services/aboutPageApi";
import { motion, type Variants } from "framer-motion";

export function TransformingHealthcareSection() {
  const { data } = useGetTransformingHealthcareActiveQuery();
  const section = data?.after_our_vision_section;

  // Only render if we have cached data
  if (!section) {
    return null;
  }

  const images = [section.image_1, section.image_2, section.image_3, section.image_4].filter(
    (img) => img,
  ) as string[];

  // Animation variants
  const titleVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants: Variants = {
    hidden: () => ({
      scale: 0.8,
      opacity: 0,
      y: 30,
    }),
    visible: (index: number) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2 + (index || 0) * 0.1,
        ease: "easeOut",
      },
    }),
  };

  const textVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full bg-secondary/30 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Title */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={titleVariants}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
            {section.title}
          </h2>
        </motion.div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16">
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="rounded-lg overflow-hidden shadow-sm border border-gray-200"
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={imageVariants}
              >
                <img
                  src={image}
                  alt={`${section.title} ${index + 1}`}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/vite.svg";
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Descriptive Paragraph */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={textVariants}
        >
          <div 
            className="text-base md:text-lg text-primary leading-relaxed text-justify prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: section.paragraph }}
          />
        </motion.div>
      </div>
    </div>
  );
}

