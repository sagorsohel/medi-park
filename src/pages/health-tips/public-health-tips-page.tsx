import { PageHeroSection } from "@/components/website/page-hero-section";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";

export default function PublicHealthTipsPage() {
    return (
        <div className="w-full bg-[#f2f7f7] min-h-screen">
            {/* Banner Section */}
            <PageHeroSection
                image="https://lifelinehospitalkerala.com/wp-content/uploads/2025/04/happy-fit-young-lady-writing-diet-plan-notebook-indoor-1024x683.jpg"
                heading="HEALTH TIPS"
                overlayOpacity={0.6}
            />
            <BreadcrumbSection currentPage="Health Tips" />

            {/* Main Content Body */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
                <div className="bg-white rounded-sm shadow-sm border border-gray-100 py-24 px-8 flex flex-col items-center justify-center text-center">
                    <h2 className="text-[28px] md:text-[32px] font-bold text-[#1e293b] uppercase tracking-wide mb-6">
                        HEALTH TIPS COMING SOON
                    </h2>
                    <div className="w-full max-w-2xl h-px bg-gray-100 mb-6"></div>
                    <p className="text-[13px] font-bold text-gray-800 tracking-wide uppercase">
                        HAVING TROUBLE? CALL US ON - [ HOTLINE - 10633 ]
                    </p>
                </div>
            </div>
        </div>
    );
}
