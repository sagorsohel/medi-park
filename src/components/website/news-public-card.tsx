"use client";

import { Link } from "react-router";
import { ChevronUp } from "lucide-react";

type NewsPublicCardProps = {
  id: number;
  image: string;
  date: string;
  title: string;
  description?: string;
};

export function NewsPublicCard({ id, image, date, title, description }: NewsPublicCardProps) {
  const formattedDate = (() => {
    try {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = d.toLocaleDateString("en-US", { month: "long" });
      return `${year} | ${month}`;
    } catch {
      return date;
    }
  })();

  return (
    <Link
      to={`/news/${id}`}
      className="group relative block w-full aspect-4/5 rounded-[40px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-gray-900"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/vite.svg";
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col items-center justify-between p-8 text-white">
        {/* Top: Date */}
        <div className="w-full text-left">
          <span className="text-xl font-medium tracking-tight opacity-90">
            {formattedDate}
          </span>
        </div>

        {/* Center: Title & Description */}
        <div className="flex flex-col items-center text-center max-w-[85%]">
          <h3 className="text-xl md:text-xl font-bold leading-tight mb-4 drop-shadow-lg">
            {title}
          </h3>

          <div className="w-12 h-1 bg-white/80 rounded-full mb-6" />

          {description && (
            <p className="text-sm sm:text-sm  font-medium leading-relaxed opacity-90 line-clamp-3 px-2">
              {description.replace(/<[^>]*>?/gm, '')}
            </p>
          )}
        </div>

        {/* Bottom: Action */}
        <div className="flex flex-col items-center gap-1 group-hover:translate-y-[-5px] transition-transform duration-300">
          <ChevronUp className="w-8 h-8 md:w-10 md:h-10 text-white animate-bounce" />
          <span className="text-xl font-bold tracking-wide uppercase">
            See All
          </span>
        </div>
      </div>
    </Link>
  );
}



