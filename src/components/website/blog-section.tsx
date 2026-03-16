"use client";

import { Link } from "react-router";
import { useMemo } from "react";
import { useGetBlogsPublicQuery } from "@/services/blogApi";
import { Loader2 } from "lucide-react";
import { BlogCard } from "./blog-card";

export function BlogSection() {
  const { data, isLoading } = useGetBlogsPublicQuery(1);

  // Get first 3 active blog posts for the home page section
  const blogPosts = useMemo(() => {
    if (!data?.data) return [];
    return data.data.slice(0, 3);
  }, [data]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full bg-[#fcfdff] py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
              Health <span className="text-primary">Insight</span>
            </h2>
          </div>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
    <div className="w-full bg-[#fcfdff] py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
            Health <span className="text-primary">Insight</span>
          </h2>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {blogPosts.map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              image={post.feature_image}
              title={post.title}
              description={post.description}
              authorName={post.author_name}
              authorImage={post.author_image}
              readTime="10 Min Read"
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            to="/health-insight"
            className="inline-flex items-center justify-center px-10 py-4 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            Explore All Insights
          </Link>
        </div>
      </div>
    </div>
  );
}


