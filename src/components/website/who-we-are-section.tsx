"use client";

import { useGetWhoWeAreActiveQuery } from "@/services/aboutPageApi";
import { motion } from "framer-motion";

export function WhoWeAreSection() {
  const { data } = useGetWhoWeAreActiveQuery();
  const record = data?.who_we_are_section;

  // Only render if we have cached data
  if (!record) {
    return null;
  }

  return (
    <div className="w-full bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 xl:gap-20">

          {/* Left Tall Image */}
          <motion.div
            className="w-full lg:w-5/12 flex-shrink-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative h-[400px] lg:h-full min-h-[500px] xl:min-h-[600px] w-full rounded-2xl md:rounded-[40px] overflow-hidden shadow-lg border border-gray-100">
              {record.image_1 ? (
                <img
                  src={record.image_1}
                  className="w-full h-full object-cover absolute inset-0"
                  alt="Who we are"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/vite.svg";
                  }}
                />
              ) : (
                <div className="w-full h-full absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Content Area */}
          <motion.div
            className="w-full lg:w-7/12 flex flex-col justify-center py-4 lg:py-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {/* Headers */}
            <div className="mb-8">
              <h4 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
                More About Us
              </h4>
              <h2 className="text-4xl md:text-5xl lg:text-[50px] font-bold text-[#0B1B3D] leading-tight lg:leading-[1.15]">
                {record.title || "We Are A Clinic, Provide Excellence In Personalized Care"}
              </h2>
            </div>

            {/* Content Paragraph */}
            <div className="pl-6 md:pl-8 pr-8 border-l-[3px] border-primary mb-12">
              <div
                className="text-gray-600 text-base md:text-lg leading-relaxed   max-w-4xl"
                dangerouslySetInnerHTML={{ __html: record.paragraph || "" }}
              />
            </div>

            {/* Bottom Images Row */}
            {(record.image_2 || record.image_3) && (
              <div className="flex flex-col sm:flex-row gap-6 mt-auto">
                {record.image_2 && (
                  <motion.div
                    className="w-full sm:w-1/2 relative h-64 md:h-72 lg:h-80 rounded-t-[40px] rounded-b-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                  >
                    <img
                      src={record.image_2}
                      alt="Who we are 2"
                      className="w-full h-full object-cover block"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/vite.svg";
                      }}
                    />
                  </motion.div>
                )}
                {record.image_3 && (
                  <motion.div
                    className="w-full sm:w-1/2 relative h-64 md:h-72 lg:h-80 rounded-t-[40px] rounded-b-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                  >
                    <img
                      src={record.image_3}
                      alt="Who we are 3"
                      className="w-full h-full object-cover block"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/vite.svg";
                      }}
                    />
                  </motion.div>
                )}
              </div>
            )}

          </motion.div>

        </div>
      </div>
    </div>
  );
}