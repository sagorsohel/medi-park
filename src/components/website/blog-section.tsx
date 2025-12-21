"use client";

import { Link } from "react-router";
import { useMemo } from "react";
import { useGetBlogsPublicQuery } from "@/services/blogApi";
import { Loader2 } from "lucide-react";

export function BlogSection() {
  const { data, isLoading } = useGetBlogsPublicQuery(1);

  // Get first 6 active blog posts
  const blogPosts = useMemo(() => {
    if (!data?.data) return [];
    return data.data.slice(0, 6);
  }, [data]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">Blog</h2>
            <div className="w-0.5 h-8 bg-primary mx-auto mt-2" />
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  // Only render if we have data
  if (blogPosts.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">Blog</h2>
          <div className="w-0.5 h-8 bg-primary mx-auto mt-2" />
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.feature_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/vite.svg";
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Date Badge */}
                <div className="inline-block border-2 border-blue-200 rounded-full px-4 py-1 mb-3">
                  <span className="text-sm text-primary font-medium">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>

                {/* Read More Link */}
                <Link
                  to={`/blogs/${post.id}`}
                  className="text-blue-600 underline hover:text-blue-800 transition-colors"
                >
                  Read more
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

