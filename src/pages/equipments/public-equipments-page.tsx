import { Loader2, ArrowRightCircle } from "lucide-react";
import { useGetEquipmentsPublicQuery, type Equipment } from "@/services/equipmentApi";
import { PageHeroSection } from "@/components/website/page-hero-section";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";

export default function PublicEquipmentsPage() {
    const { data: equipmentsData, isLoading } = useGetEquipmentsPublicQuery();
    const equipments = equipmentsData?.data || [];

    // Group equipments by category name
    const categorizedEquipments = equipments.reduce((acc, eq) => {
        const catName = eq.equipment_category?.name || "Other Equipments";
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(eq);
        return acc;
    }, {} as Record<string, Equipment[]>);

    const categoryNames = Object.keys(categorizedEquipments);

    return (
        <div className="w-full bg-[#f2f7f7] min-h-screen py-28">
            {/* Banner Section */}
            <PageHeroSection
                image="https://5.imimg.com/data5/SELLER/Default/2020/9/FG/YB/UX/24033124/bed-head-panel-1498096-500x500.jpg"
                heading="EQUIPMENTS"
                overlayOpacity={0.6}
            />
            <BreadcrumbSection currentPage="Equipments" />

            {/* Main Content Body */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
                {isLoading ? (
                    <div className="flex py-24 items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-[#00A884]" />
                    </div>
                ) : categoryNames.length === 0 ? (
                    <div className="bg-white p-12 text-center text-gray-500 rounded-xl shadow-sm border border-gray-100 italic">
                        No equipment information available currently.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {categoryNames.map((category) => (
                            <div
                                key={category}
                                className="bg-white rounded-md shadow-sm border border-gray-100 flex overflow-hidden shrink-0"
                            >
                                {/* Left Thick Border Match */}
                                <div className="w-1.5 bg-[#00A884] shrink-0"></div>

                                {/* Card Body */}
                                <div className="p-6 w-full lg:p-8">
                                    <h3 className="text-[#1e293b] font-bold text-lg md:text-xl uppercase tracking-wide mb-6">
                                        {category}
                                    </h3>
                                    <ul className="space-y-3.5">
                                        {categorizedEquipments[category].map((item) => (
                                            <li key={item.id} className="flex items-start">
                                                <ArrowRightCircle className="w-4 h-4 shrink-0 text-[#00A884] mr-2.5 mt-[2px]" />
                                                <span className="text-[#3fc0ad] hover:text-[#00A884] transition-colors text-[14.5px] font-medium leading-relaxed">
                                                    {item.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
