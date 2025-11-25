"use client";

interface TransformingHealthcareSectionProps {
  title: string;
  images: string[];
  text: string;
}

export function TransformingHealthcareSection({ 
  title, 
  images, 
  text 
}: TransformingHealthcareSectionProps) {
  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900">
            {title}
          </h2>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16">
          {images.map((image, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
            </div>
          ))}
        </div>

        {/* Descriptive Paragraph */}
        <div className="max-w-4xl mx-auto">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

