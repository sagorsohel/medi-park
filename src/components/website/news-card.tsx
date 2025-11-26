"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

interface NewsCardProps {
  image: string;
  date: string;
  title: string;
  link?: string;
}

export function NewsCard({ image, date, title, link = "#" }: NewsCardProps) {
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
      <CardContent className="p-3 bg-[#E3F0FF]">
        <p className="text-sm text-gray-600 mb-2">{date}</p>
        <h3 className="text-lg font-semibold text-text mb-3 line-clamp-2">
          {title}
        </h3>
        <Link 
          to={link}
          className="text-blue-600 hover:text-text font-medium text-sm inline-flex items-center gap-1"
        >
          Read more
          <span>→</span>
        </Link>
      </CardContent>
    </Card>
  );
}

