"use client";

import { useGetMissionActiveQuery, useGetVisionActiveQuery } from "@/services/aboutPageApi";
import { useGetOurValuesPublicQuery } from "@/services/ourValuesApi";
import { useGetHeadingsQuery } from "@/services/headingApi";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { DynamicIcon } from "@/components/dynamic-icon";

export function MissionVisionSection() {
  const { data: missionData } = useGetMissionActiveQuery();
  const { data: visionData } = useGetVisionActiveQuery();
  const { data: valuesData } = useGetOurValuesPublicQuery();
  const { data: headingsData } = useGetHeadingsQuery();

  const mission = missionData?.our_mission_section;
  const vision = visionData?.our_vision_section;
  const values = valuesData?.data || [];
  const headings = headingsData?.data;

  // Only render if we have mission and vision data
  if (!mission || !vision) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
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
        {values.length > 0 && (
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
                  {headings?.our_values_title || "OUR VALUES"}
                </h3>
              </div>
              <p className="max-w-4xl mx-auto text-[#0B1B3D] font-medium text-[15px] md:text-base leading-relaxed">
                {headings?.our_values_description || "We are committed to providing best-in-class, accessible, private healthcare for all and we encourage all our employees and caregivers to share our values:"}
              </p>
            </motion.div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
              {values.map((item, idx) => (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-blue-100 p-8 flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                >
                  <div className="mb-6">
                    {item.icon ? (
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#0B1B3D]">
                        <DynamicIcon name={item.icon || ''} className="w-8 h-8" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#0B1B3D]">
                        <Award className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <h4 className="text-[#0B1B3D] font-bold text-lg tracking-wide mb-3">
                    {item.title}
                  </h4>
                  <p className="text-[#0B1B3D]/80 text-[14px] leading-relaxed font-medium">
                    {item.short_description || ''}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        )}
      </div>
    </section>
  );
}


