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
      <PageHeroSection image={newsItem.feature_image} heading={'News'} alt={`${newsItem.title} Hero`} />

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
        {newsItem.author_name && (
          <motion.section
            className="mt-10 px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={contentVariants}
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 md:p-8">
                <div className="w-full flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8">
                  {/* Left Side - Author Details */}
                  <div className="flex flex-col md:flex-row items-center md:items-center flex-1 gap-4 md:gap-6">
                    {newsItem.author_image && (
                      <div className="shrink-0">
                        <img
                          className="inline-flex object-cover border-4 border-indigo-600 rounded-full shadow-[5px_5px_0_0_rgba(0,0,0,1)] shadow-indigo-600 bg-indigo-50 h-32 w-32"
                          src={newsItem.author_image}
                          alt={newsItem.author_name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/vite.svg";
                          }}
                        />
                      </div>
                    )}
                    <div className="flex flex-col text-center md:text-left">
                      <p className="text-indigo-900 font-bold text-xl mb-2">
                        {newsItem.author_name}
                      </p>
                      {newsItem.author_designation && (
                        <p className="text-indigo-600 font-semibold text-sm md:text-base">
                          {newsItem.author_designation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Share Icons */}
                  <div className="flex flex-col items-center md:items-end border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Share this blog</p>
                    <ul className="flex flex-row items-center gap-4">
                      <li>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on Facebook"
                          className="transition-transform hover:scale-110"
                        >
                          <svg
                            className="h-7 w-7 text-blue-600 hover:text-blue-800"
                            fill="currentColor"
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Facebook</title>
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(newsItem.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on Twitter"
                          className="transition-transform hover:scale-110"
                        >
                          <svg
                            className="h-7 w-7 text-blue-400 hover:text-blue-600"
                            fill="currentColor"
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Twitter</title>
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on LinkedIn"
                          className="transition-transform hover:scale-110"
                        >
                          <svg
                            className="h-7 w-7 text-blue-700 hover:text-blue-900"
                            fill="currentColor"
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>LinkedIn</title>
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert('Link copied to clipboard!');
                          }}
                          aria-label="Copy link"
                          className="transition-transform hover:scale-110"
                        >
                          <svg
                            className="h-7 w-7 text-gray-600 hover:text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Copy Link</title>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

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

