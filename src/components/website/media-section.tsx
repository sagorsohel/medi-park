"use client";

import { useState, useMemo } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useGetNewsPublicQuery } from "@/services/newsApi";
import { motion, type Variants } from "framer-motion";
import { NewsPublicCard } from "./news-public-card";

export function MediaSection() {
  const { data } = useGetNewsPublicQuery(1);
  const navigate = useNavigate();

  // Get first 3 active news items
  const newsItems = useMemo(() => {
    if (!data?.data) return [];
    return data.data.slice(0, 3);
  }, [data]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % newsItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  };

  // Only render if we have cached data
  if (newsItems.length === 0) {
    return null;
  }

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

  const cardVariants: Variants = {
    hidden: { y: 50, opacity: 0, scale: 0.95 },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.1 * index,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <div className="w-full bg-[#fcfdff] py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1e293b] mb-4">
            News & <span className="text-primary">Media</span>
          </h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        {/* News Carousel */}
        <div className="relative mb-20">
          {/* Navigation Arrows - Show on mobile only */}
          {newsItems.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="md:hidden absolute left-[-10px] top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-gray-50 transition-colors shadow-xl"
                aria-label="Previous news"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextSlide}
                className="md:hidden absolute right-[-10px] top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-gray-50 transition-colors shadow-xl"
                aria-label="Next news"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* News Cards */}
          <div className="relative">
            {/* Mobile: Single slide slider */}
            <div className="md:hidden overflow-hidden rounded-[40px]">
              <motion.div
                className="flex transition-transform duration-500 ease-out"
                animate={{
                  x: `-${currentIndex * 100}%`,
                }}
                style={{
                  width: `${newsItems.length * 100}%`,
                }}
              >
                {newsItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="w-full shrink-0 px-2"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={cardVariants}
                    custom={index}
                  >
                    <NewsPublicCard
                      id={item.id}
                      image={item.feature_image}
                      date={item.created_at}
                      title={item.title}
                      description={item.description}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Desktop: Grid layout */}
            <motion.div
              className="hidden md:grid md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={containerVariants}
            >
              {newsItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  custom={index}
                  variants={cardVariants}
                >
                  <NewsPublicCard
                    id={item.id}
                    image={item.feature_image}
                    date={item.created_at}
                    title={item.title}
                    description={item.description}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Mobile: Dots indicator */}
          {newsItems.length > 1 && (
            <div className="md:hidden flex justify-center gap-2 mt-8">
              {newsItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-primary w-10" : "bg-gray-200 w-2"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>


        {/* View All Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Button
            onClick={() => {
              navigate("/news");
            }}
            className="bg-primary text-white hover:bg-blue-800 px-8 py-6 text-lg rounded-lg"
          >
            View all Medipark News
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

