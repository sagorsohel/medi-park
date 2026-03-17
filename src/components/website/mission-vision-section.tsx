"use client";

import { useGetMissionActiveQuery, useGetVisionActiveQuery } from "@/services/aboutPageApi";
import { motion } from "framer-motion";
import { Award, Scale, HeartPulse, HandHeart, Lightbulb } from "lucide-react";

export function MissionVisionSection() {
  const { data: missionData } = useGetMissionActiveQuery();
  const { data: visionData } = useGetVisionActiveQuery();

  const mission = missionData?.our_mission_section;
  const vision = visionData?.our_vision_section;

  // Only render if we have cached data
  if (!mission || !vision) {
    return null;
  }

  const valuesItems = [
    {
      title: "Quality",
      description: "We are committed to providing quality healthcare for every patient.",
      icon: <Award className="w-12 h-12 text-[#65A30D]" />, // Green color
    },
    {
      title: "Integrity",
      description: "We do the right thing, every time, even when no one is looking",
      icon: <Scale className="w-12 h-12 text-[#9333EA]" />, // Purple color
    },
    {
      title: "Passionate",
      description: "We are passionate about healthcare and this shows in the care we provide",
      icon: <HeartPulse className="w-12 h-12 text-[#DC2626]" />, // Red color
    },
    {
      title: "Respect",
      description: "We are respectful of everyone regardless of our differences and diversity",
      icon: <HandHeart className="w-12 h-12 text-[#0284C7]" />, // Blue
    },
    {
      title: "Innovative",
      description: "We believe innovation allows us to improve our patients' experience, increase caregiver engagement and ensure the health of our business",
      icon: <Lightbulb className="w-12 h-12 text-[#1E3A8A]" />, // Navy
    }
  ];

  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Row: Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12 mb-24">

          {/* Vision */}
          <motion.div
            className="text-center w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-block relative w-full px-4 sm:px-8 md:px-10">
              <h3 className="w-full px-6 md:px-12 py-4 bg-white shadow-[0_0_20px_rgba(0,0,0,0.08)] border-2 border-transparent hover:border-blue-50 text-[#0B1B3D] font-bold text-lg md:text-xl uppercase tracking-widest inline-block transition-colors">
                {vision.title || "OUR VISION"}
              </h3>
            </div>
            <div className="mt-8 px-4 sm:px-8 md:px-10">
              <div
                className="text-[#0B1B3D] text-[15px] md:text-base leading-relaxed w-full mx-auto font-medium"
                dangerouslySetInnerHTML={{ __html: vision.paragraph || "To become the leading tertiary & quaternary care hospital chain, providing best-in-class, private healthcare of international standards, accessible to Bangladeshi citizens." }}
              />
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div
            className="text-center w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <div className="inline-block relative w-full px-4 sm:px-8 md:px-10">
              <h3 className="w-full px-6 md:px-12 py-4 bg-white shadow-[0_0_20px_rgba(0,0,0,0.08)] border-2 border-transparent hover:border-blue-50 text-[#0B1B3D] font-bold text-lg md:text-xl uppercase tracking-widest inline-block transition-colors">
                {mission.title || "OUR MISSION"}
              </h3>
            </div>
            <div className="mt-8 px-4 sm:px-8 md:px-10">
              <div
                className="text-[#0B1B3D] text-[15px] md:text-base leading-relaxed w-full mx-auto font-medium"
                dangerouslySetInnerHTML={{ __html: mission.paragraph || "Set up quaternary care capabilities in all specialties so that Bangladeshi citizens do not need to travel out of country for medical treatments." }}
              />
            </div>
          </motion.div>

        </div>

        {/* Bottom Section: Our Values */}
        <div className="flex flex-col items-center">

          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-block relative mb-8 px-4 sm:px-8 md:px-10 min-w-[300px] sm:min-w-[400px]">
              <h3 className="w-full px-6 md:px-12 py-4 bg-white shadow-[0_0_20px_rgba(0,0,0,0.08)] border-2 border-transparent hover:border-blue-50 text-[#0B1B3D] font-bold text-lg md:text-xl uppercase tracking-widest inline-block transition-colors">
                OUR VALUES
              </h3>
            </div>
            <p className="max-w-4xl mx-auto text-[#0B1B3D] font-medium text-[15px] md:text-base leading-relaxed">
              We are committed to providing best-in-class, accessible, private healthcare for all and we encourage all our employees and caregivers to share our values:
            </p>
          </motion.div>

          {/* Values Grid */}
          <div className="flex justify-center w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
              {valuesItems.slice(0, 3).map((item, idx) => (
                <motion.div
                  key={idx}
                  className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-blue-100 p-8 flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                >
                  <div className="mb-6">
                    {item.icon}
                  </div>
                  <h4 className="text-[#0B1B3D] font-bold text-lg tracking-wide mb-3">
                    {item.title}
                  </h4>
                  <p className="text-[#0B1B3D]/80 text-[14px] leading-relaxed font-medium">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex justify-center w-full mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
              {valuesItems.slice(3, 5).map((item, idx) => (
                <motion.div
                  key={idx + 3}
                  className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-blue-100 p-8 flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1, ease: "easeOut" }}
                >
                  <div className="mb-6">
                    {item.icon}
                  </div>
                  <h4 className="text-[#0B1B3D] font-bold text-lg tracking-wide mb-3">
                    {item.title}
                  </h4>
                  <p className="text-[#0B1B3D]/80 text-[14px] leading-relaxed font-medium">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

