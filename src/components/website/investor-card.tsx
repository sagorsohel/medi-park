"use client";

interface InvestorCardProps {
  image: string;
  name: string;
  designation: string;
  description: string;
}

export function InvestorCard({ image, name, designation, description }: InvestorCardProps) {
  return (
    <div className="group border border-blue-900 rounded-[22px] overflow-hidden min-w-[280px] lg:min-w-0 h-[222px] cursor-pointer perspective-1000">
      {/* Flip Card Container */}
      <div className="relative w-full h-full transition-transform duration-500 ease-in-out transform-style-preserve-3d group-hover:rotate-y-180">
        {/* Front Face - Image */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-primary p-0.5 rounded-[22px]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-[22px]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/vite.svg";
            }}
          />
        </div>

        {/* Back Face - Details */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-blue-900 text-white p-6 flex flex-col items-center justify-center space-y-2 rounded-[22px] rotate-y-180">
          <h3 className="text-base font-bold uppercase text-center leading-tight">
            {name}
          </h3>
          <p className="text-sm text-center">
            "{designation}"
          </p>
          <p className="text-xs text-center leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

