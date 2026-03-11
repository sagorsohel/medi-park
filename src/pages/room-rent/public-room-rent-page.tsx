import { Loader2 } from "lucide-react";
import { PageHeroSection } from "@/components/website/page-hero-section";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { useGetRoomRentsPublicQuery } from "@/services/roomRentApi";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function PublicRoomRentPage() {
    const { data: roomRentsData, isLoading } = useGetRoomRentsPublicQuery();
    const roomRents = roomRentsData?.data || [];

    return (
        <div className="w-full bg-[#f2f7f7] min-h-screen">
            {/* Top Banner & Breadcrumb */}
            <PageHeroSection
                image="https://cms-img.coverfox.com/room-rent-limit-silent.jpg"
                heading="ROOM RENT"
                overlayOpacity={0.5}
            />
            <BreadcrumbSection currentPage="Room Rent" />

            {/* Main Content Body */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 text-center pb-6 border-b border-gray-100">
                        <h2 className="text-[28px] font-bold text-[#1e293b] uppercase tracking-wide">
                            ROOM RENT
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="flex py-24 items-center justify-center">
                            <Loader2 className="w-10 h-10 animate-spin text-[#00A884]" />
                        </div>
                    ) : roomRents.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 italic">
                            No room rent data available currently.
                        </div>
                    ) : (
                        <div className="p-0 overflow-x-auto">
                            <Table className="w-full">
                                <TableHeader className="bg-white border-b border-gray-200">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-20 font-bold text-gray-900 uppercase py-5 px-6">SL</TableHead>
                                        <TableHead className="font-bold text-gray-900 uppercase py-5 px-6">BED NAME</TableHead>
                                        <TableHead className="font-bold text-gray-900 uppercase py-5 px-6">CHARGES</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roomRents.map((room, index) => (
                                        <TableRow
                                            key={room.id}
                                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/50 transition-colors border-b border-gray-100`}
                                        >
                                            <TableCell className="w-20 font-medium text-gray-600 py-4 px-6">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="text-gray-800 font-medium py-4 px-6">
                                                {room.bed_name}
                                            </TableCell>
                                            <TableCell className="text-gray-600 py-4 px-6">
                                                BDT {room.charges}/-
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
