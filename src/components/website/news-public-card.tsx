"use client";

import { Link } from "react-router";

type NewsPublicCardProps = {
  id: number;
  image: string;
  date: string;
  title: string;
  description?: string;
  category?: string;
};

export function NewsPublicCard({ id, image, date, title, description, category }: NewsPublicCardProps) {
  const formattedDate = (() => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return date;
    }
  })();

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full border border-gray-100">
      {/* Image */}
      <div className="relative w-full aspect-4/3 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/vite.svg";
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        {/* Category & Date */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {category || "News"}
          </span>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>

        {/* Title */}
        <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
            {description.replace(/<[^>]*>?/gm, "")}
          </p>
        )}

        {/* Footer: Read more */}
        <div className="flex items-center justify-end mt-auto pt-4 border-t border-gray-100">
          <Link
            to={`/news/${id}`}
            className="inline-flex items-center px-5 py-2 text-sm font-semibold text-gray-900 bg-white border border-gray-900 rounded hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}
