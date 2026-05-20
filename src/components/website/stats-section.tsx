"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Building2, Stethoscope, HeartPulse, Smile, Users, Award, Calendar, Heart, Loader2 } from "lucide-react";
import { useGetActiveStatsQuery } from "@/services/homepageStatsApi";

interface CounterProps {
  value: number;
  suffix?: string;
}

function Counter({ value, suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      if (end <= 0) {
        setCount(0);
        return;
      }
      const duration = 2000; // 2 seconds
      const increment = Math.ceil(end / (duration / 16)); // ~60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function parseCount(countStr: string) {
  if (!countStr) return { value: 0, suffix: "" };
  const cleaned = countStr.replace(/,/g, '');
  const numberMatch = cleaned.match(/^(\d+)/);
  
  if (numberMatch) {
    const value = parseInt(numberMatch[1], 10);
    const suffix = cleaned.slice(numberMatch[1].length);
    return { value, suffix };
  }
  
  return { value: 0, suffix: countStr };
}

const getIconForIndex = (index: number) => {
  const icons = [Building2, Stethoscope, HeartPulse, Smile, Users, Award, Calendar, Heart];
  return icons[index % icons.length];
};

export function StatsSection() {
  const { data, isLoading } = useGetActiveStatsQuery();

  const fallbackStats = [
    {
      id: 1,
      title: "Speciality Departments",
      count: "35+",
      short_description: "Fully equipped dynamic clinics"
    },
    {
      id: 2,
      title: "Expert Doctors",
      count: "100+",
      short_description: "Dedicated board-certified specialists"
    },
    {
      id: 3,
      title: "Trained Nurses",
      count: "300+",
      short_description: "Caring support around the clock"
    },
    {
      id: 4,
      title: "Happy Patients",
      count: "100,000+",
      short_description: "Cured with world-class excellence"
    }
  ];

  const stats = data?.success && data?.data && data.data.length > 0 ? data.data : fallbackStats;

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="w-full bg-[#FAFBFD] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative bg-gradient-to-r from-[#0B1B3D] via-[#0E2757] to-[#0B1B3D] rounded-3xl py-14 px-8 md:px-12 shadow-2xl overflow-hidden border border-white/5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Radial Ambient Glows */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[130px] pointer-events-none -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00A884]/5 rounded-full blur-[100px] pointer-events-none -ml-30 -mb-30" />

          {/* Premium Stethoscope SVG Watermark */}
          <div className="absolute right-4 bottom-0 top-0 w-1/4 opacity-[0.03] pointer-events-none flex items-center justify-end select-none">
            <svg
              className="w-72 h-72 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v4m0 0a4 4 0 01-4-4v-.5M12 8a4 4 0 004-4v-.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 3.5a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0zM12 8v4c0 3.314-2.686 6-6 6H5" />
              <circle cx="4" cy="18" r="2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c0 3.314 2.686 6 6 6h1" />
              <circle cx="20" cy="18" r="1.5" />
            </svg>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-white/70">
              <Loader2 className="w-8 h-8 animate-spin mr-3 text-primary" />
              <span className="font-bold tracking-wider uppercase text-sm">Loading statistics...</span>
            </div>
          ) : (
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0">
              {stats.map((stat, idx) => {
                const Icon = getIconForIndex(idx);
                const { value, suffix } = parseCount(stat.count);

                return (
                  <motion.div
                    key={stat.id}
                    variants={itemVariants}
                    className={`flex flex-col items-center text-center lg:px-6 relative group transition-all duration-300 ${
                      idx !== stats.length - 1 && idx !== 3 ? "lg:border-r lg:border-white/10" : ""
                    }`}
                  >
                    {/* Glowing Icon Container */}
                    <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-[#00A884]/15 group-hover:border-[#00A884]/40 transition-all duration-500 shadow-inner scale-100 group-hover:scale-110">
                      <Icon className="w-8 h-8 text-primary group-hover:text-[#00A884] transition-colors duration-300" />
                    </div>

                    {/* Animated Counter */}
                    <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2.5 tracking-tight group-hover:text-primary transition-colors duration-300">
                      <Counter value={value} suffix={suffix} />
                    </h3>

                    {/* Label */}
                    <p className="text-[13px] font-bold text-gray-200 uppercase tracking-widest mb-1.5 transition-colors group-hover:text-primary">
                      {stat.title}
                    </p>

                    {/* Short Subtitle */}
                    {stat.short_description && (
                      <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {stat.short_description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
