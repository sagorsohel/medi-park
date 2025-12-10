"use client";

import { HeroSectionManage } from "@/components/admin/hero-section-manage";
import { AboutSectionManage } from "@/components/admin/about-section-manage";
import { AboutBannerManage } from "@/components/admin/about-banner-manage";
import { FacilitiesManage } from "@/components/admin/facilities-manage";

export default function WebHomeManagePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">


      {/* Hero Section Management */}
      <HeroSectionManage />

      {/* About Section Management */}
      <AboutSectionManage />

      {/* About Banner Management */}
      <AboutBannerManage />

      {/* Facilities Management */}
      <FacilitiesManage />
    </div>
  );
}
