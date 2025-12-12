"use client";

import { motion } from "framer-motion";

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

import { useGetAboutPageBannerQuery } from "@/services/aboutPageApi";

export function AboutPageHero() {
  const { data } = useGetAboutPageBannerQuery();
  const banner = data?.data;

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

