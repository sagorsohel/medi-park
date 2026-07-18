"use client";

import { PageHeroSection } from "@/components/website/page-hero-section";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { useGetMissionActiveQuery } from "@/services/aboutPageApi";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { store } from "@/store";
import { aboutPageApi } from "@/services/aboutPageApi";

export default function MissionPage() {
    // Prefetch mission data on mount
    useEffect(() => {
        store.dispatch(aboutPageApi.endpoints.getMissionActive.initiate());
    }, []);

    const { data: missionData, isLoading: missionLoading } = useGetMissionActiveQuery();

    const mission = missionData?.our_mission_section;

    if (missionLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Hero Section */}
            <PageHeroSection
                image={mission?.image || "/hero1.png"}
                heading="Our Mission"
                alt="Mission Hero"
            />

            {/* BreadcrumbSection */}
            <BreadcrumbSection currentPage="Mission" />

            {/* Mission Content */}
            <section className="w-full bg-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {mission ? (
                        <motion.div
                            className="w-full"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full min-w-0">
                                {/* Left Side: Image */}
                                <div className="w-full min-w-0 rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                                    <img
                                        src={mission.image}
                                        alt={mission.title || "Our Mission"}
                                        className="w-full h-[320px] sm:h-[400px] lg:h-[480px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/vite.svg";
                                        }}
                                    />
                                </div>

                                {/* Right Side: Title & Description */}
                                <div className="flex flex-col justify-center min-w-0 w-full">
                                    <div className="mb-6">
                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
                                            {mission.title || "Our Mission"}
                                        </h2>
                                        <div className="w-16 h-1 bg-primary rounded-full" />
                                    </div>
                                    <div
                                        className="text-base md:text-lg text-gray-700 leading-relaxed prose prose-lg max-w-none"
                                        dangerouslySetInnerHTML={{ __html: (mission.paragraph || "").replace(/&nbsp;/g, " ").replace(/\u00a0/g, " ") }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                Mission information is not available at the moment.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
