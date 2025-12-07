"use client";

interface OurAchievementSectionProps {
  title: string;
  images: string[];
  text: string;
}

export function OurAchievementSection({ title, images, text }: OurAchievementSectionProps) {
  return (
    <div className="w-full bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            {title}
          </h2>
          <div className="w-0.5 h-8 bg-primary mx-auto mt-2" />
        </div>

        {/* Image Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {images.map((image, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border p-3 border-gray-200">
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full rounded-lg h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
            </div>
          ))}
        </div>

        {/* Descriptive Text Block */}
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

