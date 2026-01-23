import { motion } from 'framer-motion'
import { PageHeroSection } from '@/components/website/page-hero-section'

import { useGetDirectorsQuery, type Director } from '@/services/directorApi'

export default function MessageOfChairmanPage() {
    const { data: directorsData, isLoading } = useGetDirectorsQuery({ limit: 100 });
    const chairman = directorsData?.data?.find((d: Director) => d.designation === "Chairman");

    if (isLoading) {
        return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
    }

    if (!chairman) {
        return (
            <div className="w-full bg-slate-50 min-h-screen">
                <PageHeroSection
                    image="https://placehold.co/1920x600/1e3a8a/ffffff?text=Message+of+Chairman"
                    heading="Message of Chairman"
                    alt="Message of Chairman"
                    overlayOpacity={0.5}
                />
                <div className="container mx-auto px-4 py-16 text-center">
                    <p>Message not available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-50 min-h-screen">
            <PageHeroSection
                image={chairman.photo || "https://placehold.co/1920x600/1e3a8a/ffffff?text=Message+of+Chairman"}
                heading="Message of Chairman"
                alt="Message of Chairman"
                overlayOpacity={0.5}
            />

            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="md:w-1/3 bg-[#f0fdf4] p-8 flex items-center justify-center">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-[#10b981] rounded-lg transform rotate-3 transition-transform group-hover:rotate-6 opacity-20"></div>
                                <img
                                    src={chairman.photo || "https://placehold.co/400x500/e2e8f0/1e293b?text=Chairman"}
                                    alt={chairman.name}
                                    className="relative z-10 rounded-lg shadow-lg w-full max-w-[300px] object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/placeholder-person.jpg";
                                    }}
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-2/3 p-8 md:p-12">
                            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-2 uppercase relative inline-block">
                                MESSAGE OF CHAIRMAN
                                <div className="h-1 w-20 bg-[#10b981] mt-2 rounded-full"></div>
                            </h1>

                            <div className="space-y-6 text-gray-600 leading-relaxed mt-8 text-justify">
                                <div dangerouslySetInnerHTML={{ __html: chairman.message || "" }} />

                                <div className="pt-8 mt-8 border-t border-gray-100">
                                    <p className="text-gray-500 mb-2">Best Wishes</p>
                                    <h3 className="text-xl font-bold text-[#1e3a8a] uppercase">{chairman.name}</h3>
                                    <p className="text-[#10b981] font-medium">{chairman.designation}, BSH PLC.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
