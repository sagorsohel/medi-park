"use client";

import { useParams } from "react-router";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { NewsCard } from '@/components/website/news-card'
import { useGetNewsByIdQuery, useGetNewsPublicQuery } from "@/services/newsApi";
import { motion, type Variants } from "framer-motion";

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const newsId = id ? parseInt(id) : 0;

  const { data: newsData } = useGetNewsByIdQuery(newsId);
  const { data: relatedNewsData } = useGetNewsPublicQuery(1);

  const newsItem = newsData?.data;
  const relatedNews = relatedNewsData?.data?.filter(n => n.id !== newsId).slice(0, 6) || [];

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

  // Only render if we have cached data
  if (!newsItem) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image={newsItem.feature_image} heading={newsItem.title} alt={`${newsItem.title} Hero`} />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage={newsItem.title} />

      {/* News Detail Content */}
      <section className="w-full bg-white">
        {/* Dark Blue Header */}
        <div className="w-full bg-primary py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              {newsItem.title}
            </h1>
          </div>
        </div>

        {/* Main Image Section */}
        <motion.div
          className="w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={contentVariants}
        >
          <img
            src={newsItem.feature_image}
            alt={newsItem.title}
            className="w-[90%] mx-auto flex justify-center items-center h-120  object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/vite.svg";
            }}
          />
        </motion.div>

        {/* Author Info Section */}
        {newsItem.author_name && (
          <motion.div
            className="w-full bg-gray-50 py-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={contentVariants}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                {newsItem.author_image && (
                  <img
                    src={newsItem.author_image}
                    alt={newsItem.author_name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/vite.svg";
                    }}
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{newsItem.author_name}</p>
                  {newsItem.author_designation && (
                    <p className="text-sm text-gray-600">{newsItem.author_designation}</p>
                  )}
                </div>
              </div>
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="space-y-6 text-gray-700 prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: newsItem.description }}
            />
          </div>
        </motion.div>

        {/* Related News Section */}
        {relatedNews.length > 0 && (
          <motion.div
            className="w-full bg-white py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={contentVariants}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-primary mb-8 text-center">Related News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedNews.map((news) => (
                  <NewsCard
                    key={news.id}
                    id={news.id}
                    image={news.feature_image}
                    date={news.created_at}
                    title={news.title}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  )
}

