"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useGetNewsPublicQuery } from "@/services/newsApi";
import { motion, type Variants } from "framer-motion";
import { NewsCard } from "@/components/website/news-card";

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
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.1 * index,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">News & Media</h2>
          <div className="w-0.5 h-8 bg-primary mx-auto mt-2" />
        </div>

        {/* News Carousel */}
        <div className="relative max-w-6xl mx-auto mb-12">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-blue-100 text-primary flex items-center justify-center hover:bg-blue-200 transition-colors shadow-lg"
            aria-label="Previous news"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-blue-100 text-primary flex items-center justify-center hover:bg-blue-200 transition-colors shadow-lg"
            aria-label="Next news"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* News Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                className="transition-opacity duration-300"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.feature_image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/vite.svg";
                      }}
                    />
                  </div>
                  <div className="bg-primary text-white p-6">
                    <p className="text-sm text-blue-200 mb-2">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                    <a
                      href={`/news/${item.id}`}
                      className="text-blue-300 underline hover:text-blue-200 transition-colors"
                    >
                      Read more
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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

