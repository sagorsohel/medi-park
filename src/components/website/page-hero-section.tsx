"use client";

import { motion, type Variants } from "framer-motion";
import { useGetAboutPageBannerQuery } from "@/services/aboutPageApi";
import { useGetNewsPageBannerQuery } from "@/services/newsApi";

interface PageHeroSectionProps {
  image: string;
  heading?: string;
  alt?: string;
  overlayOpacity?: number;
}

export function PageHeroSection({ image, heading, alt = "Hero", overlayOpacity = 0.4 }: PageHeroSectionProps) {
  return (
    <motion.div
      className="relative w-full h-[250px] sm:h-[calc(100vh-200px)] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.img
          src={image}
          alt={alt}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/vite.svg";
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-gray-950"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Heading Overlay */}
      {heading && (
        <motion.div
          className="relative z-10 flex items-center justify-center h-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white text-center">
            {heading}
          </h1>
        </motion.div>
      )}
    </motion.div>
  );
}

// Animation variants for text content (defined early for use in loading state)
const titleVariants: Variants = {
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

const textVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.3,
      ease: "easeOut",
    },
  },
};

export function NewsPageHero() {
  const { data, isLoading } = useGetNewsPageBannerQuery();
  const banner = data?.data;

  // Show loading skeleton with relatable content
  if (isLoading && !banner) {
    return (
      <motion.div
        className="relative w-full h-[250px] sm:h-[calc(100vh-200px)] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Image with gradient fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-primary">
          <img
            src="/heroloader.webp"
            alt="News & Media"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gray-950" style={{ opacity: 0.5 }} />
        </div>

        {/* Loading Content Overlay */}
        <motion.div
          className="relative z-10 flex items-center justify-center h-full"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white text-center"
            variants={titleVariants}
          >
            News & Media
          </motion.h1>
        </motion.div>

        {/* Subtle loading indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </motion.div>
    );
  }

  // Only render if we have cached data
  if (!banner) return null;

  return (
    <motion.div
      className="relative w-full h-[250px] sm:h-[calc(100vh-200px)] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.img
          src={banner.background_image}
          alt="News & Media Hero"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/vite.svg";
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-gray-950"
          style={{ opacity: parseFloat(banner.opacity) }}
        />
      </div>

      {/* Heading Overlay */}
      <motion.div
        className="relative z-10 flex items-center justify-center h-full"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white text-center">
          News & Media
        </h1>
      </motion.div>
    </motion.div>
  );
}

export function AboutPageHero() {
  const { data, isLoading } = useGetAboutPageBannerQuery();
  const banner = data?.data;

  // Show loading skeleton with relatable content
  if (isLoading && !banner) {
    return (
      <motion.div
        className="relative w-full h-[250px] sm:h-[calc(100vh-200px)] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Image with gradient fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-primary">
          <img
            src="/heroloader.webp"
            alt="About Us"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gray-950" style={{ opacity: 0.5 }} />
        </div>

        {/* Loading Content Overlay */}
        <motion.div
          className="relative z-10 flex items-center justify-center h-full"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white text-center"
            variants={titleVariants}
          >
            About Us
          </motion.h1>
        </motion.div>

        {/* Subtle loading indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </motion.div>
    );
  }

  // Only render if we have cached data
  if (!banner) return null;

  return (
    <motion.div
      className="relative w-full h-[250px] sm:h-[calc(100vh-200px)] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.img
          src={banner.background_image}
          alt="About Us Hero"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/vite.svg";
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-gray-950"
          style={{ opacity: parseFloat(banner.opacity) }}
        />
      </div>

      {/* Heading Overlay */}
      <motion.div
        className="relative z-10 flex items-center justify-center h-full"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white text-center">
          About Us
        </h1>
      </motion.div>
    </motion.div>
  );
}

