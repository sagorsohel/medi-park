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
                            {/* Title */}
                            <div className="text-center mb-8">
                                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                    {mission.title || "Our Mission"}
                                </h2>
                                <div className="w-0.5 h-8 bg-gray-600 mx-auto mt-2" />
                            </div>

                            {/* Image */}
                            <div className="flex justify-center mb-6 md:mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
                                <div className="w-full max-w-7xl rounded-[12px] overflow-hidden shadow-lg border border-gray-200">
                                    <img
                                        src={mission.image}
                                        alt={mission.title || "Our Mission"}
                                        className="w-full h-[300px] md:h-[400px] object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = "/vite.svg";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Text */}
                            <div className="max-w-4xl mx-auto px-4">
                                <div
                                    className="text-base md:text-lg text-gray-700 leading-relaxed text-justify prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{ __html: mission.paragraph }}
                                />
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
