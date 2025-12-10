"use client";

import { useGetMissionActiveQuery, useGetVisionActiveQuery } from "@/services/aboutPageApi";
import { motion, type Variants } from "framer-motion";

interface MissionVisionItemProps {
  title: string;
  image: string;
  text: string;
  alt?: string;
  delay?: number;
}

function MissionVisionItem({ title, image, text, alt, delay = 0 }: MissionVisionItemProps) {
  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: "easeOut",
      },
    },
  };

  const titleVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: delay + 0.2,
        ease: "easeOut",
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: delay + 0.3,
        ease: "easeOut",
      },
    },
  };

  const textVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: delay + 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="w-full mb-16 md:mb-20 max-w-7xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={itemVariants}
    >
      {/* Title */}
      <motion.div
        className="text-center mb-4"
        variants={titleVariants}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">
          {title}
        </h2>
        <div className="w-0.5 h-8 bg-gray-600 mx-auto mt-2" />
      </motion.div>

      {/* Image */}
      <motion.div
        className="flex justify-center mb-6 md:mb-8 -mx-4 sm:-mx-6 lg:-mx-8"
        variants={imageVariants}
      >
        <div className="w-full max-w-7xl rounded-[12px] overflow-hidden shadow-sm border border-gray-200">
          <img
            src={image}
            alt={alt || title}
            className="w-full h-[300px] p-4 rounded-[12px] border object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/vite.svg";
            }}
          />
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        className="max-w-4xl mx-auto px-4"
        variants={textVariants}
      >
        <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
          {text}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function MissionVisionSection() {
  const { data: missionData } = useGetMissionActiveQuery();
  const { data: visionData } = useGetVisionActiveQuery();

  const mission = missionData?.our_mission_section;
  const vision = visionData?.our_vision_section;

  // Only render if we have cached data
  if (!mission || !vision) {
    return null;
  }

  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Our Mission */}
        <MissionVisionItem
          title={mission.title || "Our Mission"}
          image={mission.image}
          text={mission.paragraph || ""}
          alt={mission.title}
          delay={0}
        />

        {/* Our Vision */}
        <MissionVisionItem
          title={vision.title || "Our Vision"}
          image={vision.image}
          text={vision.paragraph || ""}
          alt={vision.title}
          delay={0.2}
        />
      </div>
    </div>
  );
}

