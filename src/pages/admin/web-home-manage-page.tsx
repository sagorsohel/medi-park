"use client";

import { HeroSectionManage } from "@/components/admin/hero-section-manage";
import { AboutSectionManage } from "@/components/admin/about-section-manage";

export default function WebHomeManagePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Page Management</h1>
        <p className="text-gray-600">Manage your home page sections</p>
      </div>

      {/* Hero Section Management */}
      <HeroSectionManage />

      {/* About Section Management */}
      <AboutSectionManage />
    </div>
  );
}
