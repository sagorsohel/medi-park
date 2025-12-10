"use client";

import { useGetMissionActiveQuery, useGetVisionActiveQuery } from "@/services/aboutPageApi";
import { Loader2 } from "lucide-react";

interface MissionVisionItemProps {
  title: string;
  image: string;
  text: string;
  alt?: string;
}

function MissionVisionItem({ title, image, text, alt }: MissionVisionItemProps) {
  return (
    <div className="w-full mb-16 md:mb-20 max-w-7xl ">
      {/* Title */}
      <div className="text-center mb-4">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">
          {title}
        </h2>
        <div className="w-0.5 h-8 bg-gray-600 mx-auto mt-2" />
      </div>

      {/* Image */}
      <div className="flex justify-center mb-6 md:mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="w-full max-w-7xl rounded-[12px] overflow-hidden shadow-sm border border-gray-200">
          <img
            src={image}
            alt={alt || title}
            className="w-full h-[300px] p-4 rounded-[12px] border  object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/vite.svg";
            }}
          />
        </div>
      </div>

      {/* Text */}
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
          {text}
        </p>
      </div>
    </div>
  );
}

export function MissionVisionSection() {
  const { data: missionData, isLoading: missionLoading, error: missionError } = useGetMissionActiveQuery();
  const { data: visionData, isLoading: visionLoading, error: visionError } = useGetVisionActiveQuery();

  if (missionLoading || visionLoading) {
    return (
      <div className="w-full bg-white py-16 md:py-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (missionError || visionError || !missionData?.data || !visionData?.data) {
    return (
      <div className="w-full bg-white py-16 md:py-24 flex items-center justify-center">
        <p className="text-gray-500">Mission and Vision sections are not available.</p>
      </div>
    );
  }

  const mission = missionData.data;
  const vision = visionData.data;

  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Our Mission */}
        <MissionVisionItem
          title={mission.title || "Our Mission"}
          image={mission.image}
          text={mission.paragraph || ""}
          alt={mission.title}
        />

        {/* Our Vision */}
        <MissionVisionItem
          title={vision.title || "Our Vision"}
          image={vision.image}
          text={vision.paragraph || ""}
          alt={vision.title}
        />
      </div>
    </div>
  );
}

