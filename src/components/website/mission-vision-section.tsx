"use client";

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
        <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">
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

interface MissionVisionSectionProps {
  mission: {
    title: string;
    image: string;
    text: string;
    alt?: string;
  };
  vision: {
    title: string;
    image: string;
    text: string;
    alt?: string;
  };
}

export function MissionVisionSection({ mission, vision }: MissionVisionSectionProps) {
  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Our Mission */}
        <MissionVisionItem
          title={mission.title}
          image={mission.image}
          text={mission.text}
          alt={mission.alt}
        />

        {/* Our Vision */}
        <MissionVisionItem
          title={vision.title}
          image={vision.image}
          text={vision.text}
          alt={vision.alt}
        />
      </div>
    </div>
  );
}

