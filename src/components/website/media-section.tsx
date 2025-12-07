"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

const newsItems = [
  {
    id: 1,
    image: "/about1.png",
    date: "20 November 2025",
    title: "MRCP PACES Examination Conducted in Bangladesh",
    link: "#"
  },
  {
    id: 2,
    image: "/about-2.png",
    date: "20 November 2025",
    title: "MRCP PACES Examination Conducted in Bangladesh",
    link: "#"
  },
  {
    id: 3,
    image: "/about3.png",
    date: "20 November 2025",
    title: "MRCP PACES Examination Conducted in Bangladesh",
    link: "#"
  }
];

export function MediaSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate()
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % newsItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <div
                key={item.id}
                className={`transition-opacity duration-300 ${index === currentIndex ? "opacity-100" : "opacity-100"
                  }`}
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/vite.svg";
                      }}
                    />
                  </div>
                  <div className="bg-primary text-white p-6">
                    <p className="text-sm text-blue-200 mb-2">{item.date}</p>
                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                    <a
                      href={item.link}
                      className="text-blue-300 underline hover:text-blue-200 transition-colors"
                    >
                      Read more
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button onClick={() => {
            navigate('news')
          }} className="bg-primary text-white hover:bg-blue-800 px-8 py-6 text-lg rounded-lg">
            View all Medipark News
          </Button>
        </div>
      </div>
    </div>
  );
}

