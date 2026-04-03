import { MissionVisionSection } from '@/components/website/mission-vision-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { useGetHeadingsQuery } from '@/services/headingApi'

export default function OurValuesPage() {
  const { data: headingsData } = useGetHeadingsQuery();
  const headings = headingsData?.data;

  return (
    <div className="w-full">
      <div className="relative pt-32 pb-20 bg-[#0B1B3D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-4">
                {headings?.our_values_title || "Our Values"}
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto italic">
                {headings?.our_values_description || "Rooted in integrity and innovation, our values define who we are and how we care for our community."}
            </p>
        </div>
      </div>

      <BreadcrumbSection currentPage={headings?.our_values_title || "Our Values"} />

      <MissionVisionSection />
      
      <div className="py-16 bg-gray-50 flex flex-col items-center">
         <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">Committed to Excellence</p>
         <div className="h-1 w-20 bg-primary"></div>
      </div>
    </div>
  )
}
