"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

interface EventCardProps {
  image: string;
  date: string;
  title: string;
  link?: string;
}

export function EventCard({ image, date, title, link = "#" }: EventCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow p-0">
      <div className="relative w-full h-48 overflow-hidden">
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
      <CardContent className="p-3">
        <p className="text-sm text-text mb-2 border  inline-flex p-2 rounded-full border-text ">{date}</p>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h3>
        <Link 
          to={link}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1"
        >
          Read more
          <span>→</span>
        </Link>
      </CardContent>
    </Card>
  );
}

