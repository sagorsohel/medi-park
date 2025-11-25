"use client";

interface MRCPPACESSectionProps {
  title: string;
  image: string;
  text: string;
  alt?: string;
}

export function MRCPPACESSection({ 
  title, 
  image, 
  text,
  alt 
}: MRCPPACESSectionProps) {
  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Title and Text */}
          <div>
            {/* Subtitle */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6 md:mb-8 text-left">
              {title}
            </h2>

            {/* Descriptive Paragraph */}
            <div className="max-w-full">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
                {text}
              </p>
            </div>
          </div>

          {/* Right Side - Large Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200 w-full max-w-lg">
              <img
                src={image}
                alt={alt || title}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

