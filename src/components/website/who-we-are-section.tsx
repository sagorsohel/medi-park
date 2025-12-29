"use client";

import { useGetWhoWeAreActiveQuery } from "@/services/aboutPageApi";
import { motion, type Variants } from "framer-motion";

export function WhoWeAreSection() {
  const { data } = useGetWhoWeAreActiveQuery();
  const record = data?.who_we_are_section;

  // Animation variants
  const imageVariants = {
    hidden: (idx: number) => {
      if (idx === 0) return { x: -100, opacity: 0 }; // Left image from left
      if (idx === 1) return { y: -100, opacity: 0 }; // Middle image from top
      if (idx === 2) return { x: 100, opacity: 0 }; // Right image from right
      return { opacity: 0 };
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Only render if we have cached data
  if (!record) {
    return null;
  }

  return (
    <div className="relative w-full bg-primary py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Cards - Above Heading */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {[record.image_1, record.image_2, record.image_3].map((img, idx) => (
            <motion.div
              key={idx}
              className="relative group flex justify-center"
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={imageVariants as unknown as Variants}
            >
              <div className="bg-white border-2 border-blue-200 rounded-lg overflow-hidden shadow-sm w-full">
                {img ? (
                  <img
                    src={img}
                    alt={`Who we are ${idx + 1}`}
                    className="w-full h-60 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/vite.svg";
                    }}
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center text-gray-400 bg-primary/30 rounded-t-lg">
                    No image
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Who We Are Heading */}
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={contentVariants as unknown as Variants }
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            {record.title || "Who We Are"}
          </h1>
        </motion.div>

        {/* Text Block */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={contentVariants as unknown as Variants}
        >
          <div 
            className="text-base md:text-lg text-white leading-relaxed text-justify prose prose-lg max-w-none prose-invert"
            dangerouslySetInnerHTML={{ __html: record.paragraph || "" }}
          />
        </motion.div>
      </div>
    </div>
  );
}