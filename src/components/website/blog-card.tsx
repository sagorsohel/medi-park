import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

interface BlogCardProps {
  id: string | number;
  image: string;
  date?: string;
  title: string;
  description?: string;
  authorName?: string;
  authorImage?: string;
  readTime?: string;
  link?: string;
}

export function BlogCard({
  id,
  image,
  title,
  description,
  authorName,
  authorImage,
  readTime = "10 Min Read",
  link
}: BlogCardProps) {
  const blogLink = link || `/health-insight/${id}`;

  return (
    <Card className="group overflow-hidden border-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 rounded-2xl bg-white flex flex-col h-full">
      {/* Image Container with Padding */}
      <div className="p-3">
        <div className="relative w-full h-[200px] overflow-hidden rounded-xl">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/vite.svg";
            }}
          />
        </div>
      </div>

      <CardContent className="flex-1 flex flex-col p-5 pt-2">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          <Link to={blogLink}>{title}</Link>
        </h3>

        {/* Description Excerpt */}
        {description && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-2 leading-relaxed">
            {description.replace(/<[^>]*>?/gm, '')}
          </p>
        )}

        {/* Spacer to push author info to bottom */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm shrink-0">
              <img
                src={authorImage || "/vite.svg"}
                alt={authorName || "Author"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
            </div>
            <span className="text-[14px] font-semibold text-gray-800 tracking-tight">
              {authorName || "Admin"}
            </span>
          </div>

          {/* Read Time Badge */}

        </div>
      </CardContent>
    </Card>
  );
}


