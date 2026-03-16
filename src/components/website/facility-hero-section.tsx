"use client";

import { motion } from "framer-motion";

interface FacilityHeroSectionProps {
  image?: string;
  heading?: string;
  alt?: string;
}

export function FacilityHeroSection({ image, heading, alt = "Hero" }: FacilityHeroSectionProps) {
  return (
    <motion.div
      className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden bg-linear-to-r from-[#1a7a73] via-[#239c93] to-[#1a7a73]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[80%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[80%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      {image && (
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/20" />
        </div>
      )}

      {/* Content */}
      {heading && (
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-2xl">
              {heading}
            </h1>
            <div className="mt-4 h-1.5 w-24 bg-white/30 mx-auto rounded-full blur-[1px]" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
