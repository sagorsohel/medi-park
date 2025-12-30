"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

interface BlogCardProps {
  id: string | number;
  image: string;
  date: string;
  title: string;
  link?: string;
}

export function BlogCard({ id, image, date, title, link }: BlogCardProps) {
  const blogLink = link || `/blogs/${id}`;

  return (
    <Card className="overflow-hidden p-0! border hover:shadow-lg transition-shadow">
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
      <CardContent className="p-0 px-3 pb-3">
        {/* Date Badge */}
        <div className="inline-block border-2 border-blue-200 rounded-full px-4 py-1 my-3">
          <span className="text-sm text-primary font-medium">{date}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Read More Link */}
        <Link
          to={blogLink}
          className="text-text underline  hover:text-text transition-colors"
        >
          Read more
        </Link>
      </CardContent>
    </Card>
  );
}

