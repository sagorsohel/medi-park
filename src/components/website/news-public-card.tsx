"use client";

import { Link } from "react-router";

type NewsPublicCardProps = {
  id: number;
  image: string;
  date: string;
  title: string;
};

export function NewsPublicCard({ id, image, date, title }: NewsPublicCardProps) {
  const formattedDate = (() => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return date;
    }
  })();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/vite.svg";
          }}
        />
      </div>
      <div className="bg-primary text-white p-6 flex-1 flex flex-col">
        <p className="text-sm text-blue-200 mb-2">{formattedDate}</p>
        <h3 className="text-lg font-semibold mb-3 line-clamp-2">{title}</h3>
        <Link
          to={`/news/${id}`}
          className="text-blue-300 underline hover:text-blue-200 transition-colors mt-auto inline-flex items-center gap-1"
        >
          Read more
        </Link>
      </div>
    </div>
  );
}


