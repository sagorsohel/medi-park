"use client";

import { BlogPageBannerManage } from "@/components/admin/blog-page-banner-manage";
import BlogPage from "@/pages/admin/blog/blog-page";

export default function BlogsPageManage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BlogPageBannerManage />
      <BlogPage />
    </div>
  );
}

