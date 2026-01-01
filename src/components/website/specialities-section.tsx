"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useGetFacilitiesPublicQuery } from "@/services/homepageApi";
import { motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SpecialitiesSection() {
  const { data } = useGetFacilitiesPublicQuery();
  const [currentPage, setCurrentPage] = useState(0);

  // Filter active facilities and limit to 12 for display
  const activeFacilities = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((facility) => facility.status === 'active');
  }, [data]);

  // Only render if we have cached data
  if (activeFacilities.length === 0) {
    return null;
  }

  // Cards per row (4 columns) and rows per page (3 rows = 12 cards)
  const cardsPerRow = 4;
  const rowsPerPage = 3;
  const cardsPerPage = cardsPerRow * rowsPerPage; // 12 cards
  const totalPages = Math.ceil(activeFacilities.length / cardsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // Get visible facilities for current page
  const visibleFacilities = activeFacilities.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const titleVariants: Variants = {
    hidden: { y: -30, opacity: 0 },
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

  const cardVariants: Variants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.1 * (index % 4),
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Image */}
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageVariants}
          >
            <div className="relative w-full h-[300px] md:h-[600px] rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop"
                alt="Doctor and patient consultation"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
              {/* Optional overlay for better text contrast if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </motion.div>

          {/* Right Side - Specialities Grid */}
          <div className="w-full">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1e3a5f] mb-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={titleVariants}
            >
              Our Specialities
            </motion.h2>

            {/* Facilities Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 mb-4 md:mb-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
            >
              {Array.from({ length: cardsPerPage }).map((_, index) => {
                const facility = visibleFacilities[index];
                if (!facility) {
                  // Empty placeholder to maintain grid structure - hidden on mobile to reduce height
                  return (
                    <div key={`empty-${index}`} className="hidden md:block bg-transparent rounded-lg p-3 md:p-4 min-h-[120px] h-[120px]" />
                  );
                }
                return (
                  <motion.div
                    key={facility.id}
                    custom={index}
                    variants={cardVariants}
                    className="group cursor-pointer"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={`/facilities/${facility.id}`} className="block h-full">
                      <div className="bg-white rounded-lg p-2 md:p-3 lg:p-4 h-full flex flex-col items-center justify-center text-center border border-gray-200 hover:border-[#1e3a5f] transition-all duration-300 shadow-sm hover:shadow-lg min-h-[80px] md:min-h-[120px]">
                        {/* Facility Image/Icon */}
                        <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 mb-1 md:mb-2 lg:mb-3 flex items-center justify-center">
                          <img
                            src={facility.image}
                            alt={facility.title}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/vite.svg";
                            }}
                          />
                        </div>
                        {/* Facility Title */}
                        <h3 className="text-[10px] md:text-xs lg:text-sm font-semibold text-[#1e3a5f] line-clamp-2 group-hover:text-[#1e3a5f] transition-colors leading-tight">
                          {facility.title}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Navigation and View All Button */}
            <div className="flex items-center justify-between mt-6">
              {/* Navigation Arrows */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 0}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentPage === 0
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600 shadow-md"
                    }`}
                    aria-label="Previous specialities"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentPage >= totalPages - 1}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentPage >= totalPages - 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600 shadow-md"
                    }`}
                    aria-label="Next specialities"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* View All Button */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  onClick={() => {
                    // Navigate to facilities page or scroll to more facilities
                    window.location.href = "/facilities";
                  }}
                >
                  View All Departments
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

