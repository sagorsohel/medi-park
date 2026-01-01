"use client";
import { useGetAboutUsSectionPublicQuery } from "@/services/homepageApi";
import { motion, type Variants } from "framer-motion";

export function AboutSection() {
  const { data } = useGetAboutUsSectionPublicQuery();
  const section = data?.data;

  // Only render if we have cached data
  if (!section) return null;

  // Animation variants
  const buttonVariants: Variants = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
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
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const imageVariants: Variants = {
    hidden: (index: number) => {
      if (index === 0) return { x: -100, y: 50, opacity: 0 }; // Left image from left-bottom
      if (index === 1) return { y: -50, opacity: 0 }; // Middle image from top
      if (index === 2) return { x: 100, y: 50, opacity: 0 }; // Right image from right-bottom
      return { opacity: 0 };
    },
    visible: (index: number) => ({
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.4 + index * 0.15,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="relative w-full bg-white py-8 md:py-24 overflow-hidden">
      {/* Background Circular Lines - Div (Bottom Half Only) */}
      <div className="absolute bottom-0 left-0 w-full h-2/3 pointer-events-none" style={{ zIndex: 0 }}>
        {/* First circular line - bottom half */}
        <div
          className="absolute border border-[#848484] opacity-20 rounded-full"
          style={{
            width: '1200px',
            height: '1900px',
            left: '50%',
            bottom: '30%',
            transform: 'translateX(-50%)',
            borderWidth: '2px',
            clipPath: 'inset(50% 0 0 0) '
          }}
        />
        {/* Second circular line - bottom half */}
        <div
          className="absolute border border-[#848484] opacity-20 rounded-full"
          style={{
            width: '1000px',
            height: '1300px',
            left: '50%',
            bottom: '50%',
            transform: 'translateX(-50%)',
            borderWidth: '2px',
            clipPath: 'inset(45% 0 0 0)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* About Us Navigation Button */}
        <motion.div
          className="flex flex-col items-center mb-12 md:mb-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={buttonVariants}
        >
          <button className="bg-gray-100 border border-gray-400 rounded-lg px-6 py-2 text-gray-800 font-medium text-sm md:text-base hover:bg-gray-200 transition-colors">
            {section.title || "About Us"}
          </button>
          <div className="w-0.5 h-8 bg-gray-600 mt-2" />
        </motion.div>

        {/* Mission Statement - Left Aligned */}
        <motion.div
          className="max-w-xl mx-auto mb-16 md:mb-20 px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={textVariants}
        >
          <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center">
            {section.sub_title && (
              <span className="font-bold text-gray-900">{section.sub_title} </span>
            )}
            {section.content}
          </p>
        </motion.div>

        {/* Image Cards in Arc with SVG S-Curve Connecting Lines */}
        <div className="relative max-w-6xl mx-auto px-4">
          {/* SVG for S-curve pattern connecting images */}
          <svg
            className="absolute -top-44 left-0 w-full h-full pointer-events-none hidden md:block"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMid meet"
            style={{ zIndex: 1, height: '100%' }}
          >
            {/* S-curve from top left of left image, up towards text, then down to top left of center image */}
            <path
              d="M 200 450 Q 250 200 500 250 Q 750 300 800 450"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="2"
              className="opacity-60"
            />
            {/* Curve from top left of center image down to top left of right image */}
            <path
              d="M 500 250 Q 650 300 800 450"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="2"
              className="opacity-60"
            />
            {/* Line connecting bottom of left image to bottom of center image */}
            <path
              d="M 250 550 Q 400 550 500 550"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1.5"
              className="opacity-50"
            />
            {/* Line connecting bottom of center image to bottom of right image */}
            <path
              d="M 500 550 Q 650 550 750 550"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="1.5"
              className="opacity-50"
            />
          </svg>

          {/* Images in arc layout - same positions as image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10 pb-8">
            {/* Left Image Card - Lower left position */}
            {section.image_1 && (
              <motion.div
                className="relative group transform md:translate-y-8 translate-x-6"
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={imageVariants}
              >
                <div className="bg-white border inline-flex justify-center p-2  border-gray-300 rounded-lg  shadow-sm">
                  <img
                    src={section.image_1}
                    alt="About visualization 1"
                    className="w-[262px] h-[144px]  object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/vite.svg";
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Middle Image Card - Center position (higher) */}
            {section.image_2 && (
              <motion.div
                className="relative group transform md:-translate-y-2 translate-x-12"
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={imageVariants}
              >
                <div className="bg-white border inline-flex justify-center p-2  border-gray-300 rounded-lg  overflow-hidden shadow-sm">
                  <img
                    src={section.image_2}
                    alt="About visualization 2"
                    className="w-[262px] h-[144px]  object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/vite.svg";
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Right Image Card - Lower right position */}
            {section.image_3 && (
              <motion.div
                className="relative group transform md:translate-y-8 translate-x-12"
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={imageVariants}
              >
                <div className="bg-white border inline-flex justify-center p-2  border-gray-300 rounded-lg  overflow-hidden shadow-sm">
                  <img
                    src={section.image_3}
                    alt="About visualization 3"
                    className="w-[262px] h-[144px]  object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/vite.svg";
                    }}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

