"use client";

interface InvestorCardProps {
  image: string;
  name: string;
  designation: string;
  description: string;
}

export function InvestorCard({ image, name, designation, description }: InvestorCardProps) {
  return (
    <div className="border border-blue-900 rounded-[22px] overflow-hidden min-w-[280px] lg:min-w-0">
      {/* Image Section - White Background */}
      <div className="bg-primary p-0.5">
        <img
          src={image}
          alt={name}
          className="w-full h-[222px] object-cover rounded-[22px]"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/vite.svg";
          }}
        />
      </div>

      {/* Text Section - Dark Blue Background */}
      <div className="bg-blue-900 text-white p-6 flex flex-col items-center space-y-2">
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
  );
}

