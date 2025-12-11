"use client";

import { useParams } from "react-router";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { Card, CardContent } from '@/components/ui/card'
import { useGetBlogByIdQuery } from "@/services/blogApi";
import { Loader2 } from "lucide-react";
import { motion, type Variants } from "framer-motion";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const blogId = id ? parseInt(id) : 0;

  const { data: blogData, isLoading } = useGetBlogByIdQuery(blogId);
  const blogPost = blogData?.data;

  // Animation variants
  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="w-full text-center py-20 text-gray-500">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection 
        image={blogPost.feature_image} 
        heading={'Blog'} 
        alt={`${blogPost.title} Hero`} 
      />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage={blogPost.title} />

      {/* Blog Detail Content */}
      <section className="w-full bg-white">
        {/* Dark Blue Header */}
        <motion.div
          className="w-full bg-primary h-[300px] pt-20 overflow-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={contentVariants}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              {blogPost.title}
            </h1>
          </div>
        </motion.div>

        {/* Main Image Section */}
        <motion.div
          className="max-w-7xl mx-auto -mt-28 px-8 sm:px-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={contentVariants}
        >
          <img
            src={blogPost.feature_image}
            alt={blogPost.title}
            className="w-full h-auto max-h-[300px] rounded-lg object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/vite.svg";
            }}
          />
        </motion.div>

        {/* Author Byline */}
        {blogPost.author_name && (
          <motion.div
            className="w-full bg-white py-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={contentVariants}
          >
            <div className="max-w-7xl mx-auto">
              <Card className="w-fit p-0! border border-text">
                <CardContent className="p-2">
                  <div className="flex items-center gap-4">
                    {blogPost.author_image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={blogPost.author_image}
                          alt={blogPost.author_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/vite.svg";
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-lg text-gray-900">{blogPost.author_name}</p>
                      {blogPost.author_designation && (
                        <p className="text-sm text-text">{blogPost.author_designation}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Content Section */}
        <motion.div
          className="w-full bg-white pb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={contentVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-0 lg:px-0">
            <div
              className="space-y-6 text-gray-700 prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blogPost.description }}
            />
          </div>
        </motion.div>
      </section>
    </div>
  )
}

