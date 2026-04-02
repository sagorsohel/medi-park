"use client";

import { useParams } from "react-router";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { Card, CardContent } from '@/components/ui/card'
import { useGetBlogByIdPublicQuery } from "@/services/blogApi";
import { Loader2 } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { ShareCard } from "@/components/website/share-card";

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

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const blogId = id ? parseInt(id) : 0;

  const { data: blogData, isLoading, error } = useGetBlogByIdPublicQuery(blogId);
  const blogPost = blogData?.data;
  console.log("Blog ID params:", id, "Parsed blogId:", blogId, "Data:", blogData, "Error:", error);

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
        heading={'Health Insight'}
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
            className="w-full h-auto max-h-[400px] rounded-lg object-cover shadow-2xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/vite.svg";
            }}
          />
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="w-full bg-white py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={contentVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Side: Content */}
              <div className="lg:col-span-8 flex flex-col gap-10">
                <div
                  className="text-gray-700 prose prose-lg max-w-none prose-img:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: blogPost.description }}
                />

                {/* Author Byline Integrated into Content Area */}
                {blogPost.author_name && (
                  <Card className="w-fit p-0 border border-gray-100 shadow-sm overflow-hidden bg-gray-50/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-6">
                        {blogPost.author_image && (
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm">
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
                          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">Written by</p>
                          <p className="font-bold text-2xl text-gray-900 leading-tight">{blogPost.author_name}</p>
                          {blogPost.author_designation && (
                            <p className="text-base text-gray-500 font-medium">{blogPost.author_designation}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Side: Sidebar with Share Card */}
              <div className="lg:col-span-4 lg:block">
                <ShareCard />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
