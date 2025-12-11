"use client";

import { useState } from "react";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { BlogCard } from '@/components/website/blog-card'
import { useGetBlogPageBannerQuery } from "@/services/blogPageApi";
import { useGetBlogsPublicQuery } from "@/services/blogApi";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion, type Variants } from "framer-motion";

export default function BlogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: bannerData } = useGetBlogPageBannerQuery();
  const { data, isLoading } = useGetBlogsPublicQuery(currentPage);
  
  const blogItems = data?.data || [];
  const pagination = data?.pagination;
  const banner = bannerData?.data;

  const heroImage = banner?.background_image ?? "/hero1.png";
  const heroOpacity = banner?.opacity ? parseFloat(banner.opacity) : 0.4;

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.1 * (index % 6),
        ease: "easeOut",
      },
    }),
  };

  const hasMore = pagination && pagination.current_page < pagination.total_page;

  const handleLoadMore = () => {
    if (hasMore && pagination) {
      setCurrentPage(pagination.current_page + 1);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection 
        image={heroImage} 
        heading="Blogs" 
        alt="Blogs Hero"
        overlayOpacity={heroOpacity}
      />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Blogs" />
      
      {/* Blogs Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Blogs
            </h2>
            <div className="w-44 h-1 bg-primary mx-auto"></div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-center mb-12 max-w-4xl mx-auto">
            Stay updated with our latest health insights, medical breakthroughs, and expert advice 
            from our team of healthcare professionals.
          </p>

          {/* Blog Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {isLoading && currentPage === 1 ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : blogItems.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No blogs available at the moment.
              </div>
            ) : (
              blogItems.map((blog, index) => (
                <motion.div key={blog.id} custom={index} variants={cardVariants}>
                  <BlogCard
                    id={blog.id}
                    image={blog.feature_image}
                    date={formatDate(blog.created_at)}
                    title={blog.title}
                  />
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Load More Button */}
          {hasMore && (
            <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-8 py-6 text-lg"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </motion.div>
          )}

          {/* Pagination Info */}
          {pagination && (
            <div className="text-center mt-8 text-gray-600">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{" "}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total_count)} of{" "}
              {pagination.total_count} blogs
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

