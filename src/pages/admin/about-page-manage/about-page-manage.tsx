"use client";


import { AboutBannerManage } from "@/components/admin/about-banner-manage";
import { WhoWeAreManage } from "@/components/admin/who-we-are-manage";

export default function AboutPageManage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">




            {/* About Banner Management */}
            <AboutBannerManage />
            
            {/* Who We Are Section */}
            <WhoWeAreManage />
        </div>
    );
}
