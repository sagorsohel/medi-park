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

  // Filter active facilities
  const activeFacilities = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((facility) => facility.status === 'active');
  }, [data]);

  // Only render if we have cached data
  if (activeFacilities.length === 0) {
    return null;
  }

  // Cards per row (5 columns) and rows per page (3 rows = 15 cards)
  const cardsPerRow = 5;
  const rowsPerPage = 3;
  const cardsPerPage = cardsPerRow * rowsPerPage; // 15 cards
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
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="relative w-full bg-white py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-8 lg:gap-12 items-start">
          {/* Left Side - Image */}
          <motion.div
            className="hidden xl:block relative h-full min-h-[600px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageVariants}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-none">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=1000&fit=crop"
                alt="Doctor and patient consultation"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
            </div>
          </motion.div>

          {/* Right Side - Specialities Grid */}
          <div className="w-full flex flex-col h-full justify-between">
            <div>
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-[#1e3a5f] mb-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Our Specialities
              </motion.h2>

              {/* Facilities Grid */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                key={currentPage} // Animate on page change
              >
                {Array.from({ length: cardsPerPage }).map((_, index) => {
                  const facility = visibleFacilities[index];
                  // If no facility (filler), render invisible placeholder to maintain grid
                  if (!facility) {
                    return <div key={`empty-${index}`} className="hidden lg:block h-[140px]" />;
                  }

                  return (
                    <motion.div
                      key={facility.id}
                      variants={cardVariants}
                      className="group"
                    >
                      <Link to={`/facilities/${facility.id}`} className="block h-full">
                        <div className="bg-[#F8FBFF] rounded-[16px] p-4 h-[140px] flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-primary hover:shadow-md border border-transparent hover:border-primary">
                          {/* Facility Icon */}
                          <div className="w-12 h-12 mb-3 flex items-center justify-center">
                            <img
                              src={facility.image}
                              alt={facility.title}
                              className="w-full h-full object-contain rounded-lg  md:group-hover:invert transition-all duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/vite.svg";
                              }}
                            />
                          </div>
                          {/* Facility Title */}
                          <h3 className="text-xs sm:text-sm font-semibold text-[#1e3a5f] line-clamp-3 md:group-hover:text-white transition-colors duration-300 leading-tight px-1">
                            {facility.title}
                          </h3>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Navigation and View All Button */}
            <div className="flex items-center justify-between mt-auto pt-4">
              {/* Navigation Arrows */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${currentPage === 0
                    ? "border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border-[#84CC16] text-[#84CC16] hover:bg-[#84CC16] hover:text-white"
                    }`}
                  aria-label="Previous specialities"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentPage >= totalPages - 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${currentPage >= totalPages - 1
                    ? "border-gray-300 text-gray-300 cursor-not-allowed"
                    : "border-[#84CC16] text-[#84CC16] hover:bg-[#84CC16] hover:text-white"
                    }`}
                  aria-label="Next specialities"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>

              {/* View All Button */}
              <Link to="/facilities">
                <Button
                  className="bg-primary hover:bg-primary text-white px-8 py-2.5 rounded text-sm font-semibold transition-colors shadow-none"
                >
                  View All Specialities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

