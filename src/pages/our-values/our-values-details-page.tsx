"use client";

import { useParams } from "react-router";
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { useGetOurValueByIdQuery, useGetOurValuesPublicQuery } from "@/services/ourValuesApi";
import { useGetHeadingsQuery } from "@/services/headingApi";
import { motion } from "framer-motion";
import { DynamicIcon } from "@/components/dynamic-icon";
import { Award, ChevronRight } from "lucide-react";
import { Link } from "react-router";

export default function OurValuesDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const valueId = id ? parseInt(id) : 0;

  const { data: valueData, isLoading } = useGetOurValueByIdQuery(valueId);
  const { data: allValuesData } = useGetOurValuesPublicQuery();
  const { data: headingsData } = useGetHeadingsQuery();

  const valueItem = valueData?.data;
  const otherValues = allValuesData?.data?.filter(v => v.id !== valueId).slice(0, 5) || [];
  const headings = headingsData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!valueItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Value not found</h2>
        <Link to="/our-values" className="text-primary hover:underline font-semibold">Back to Our Values</Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 bg-[#0B1B3D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                   {valueItem.icon ? (
                       <DynamicIcon name={valueItem.icon} className="w-10 h-10 text-white" />
                   ) : (
                       <Award className="w-10 h-10 text-white" />
                   )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-4">
                    {valueItem.title}
                </h1>
                <p className="text-blue-200 max-w-2xl mx-auto text-lg font-medium">
                    {valueItem.short_description}
                </p>
            </div>
        </div>
      </div>

      <BreadcrumbSection currentPage={valueItem.title} />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                   <h2 className="text-3xl font-bold text-[#0B1B3D] mb-6 border-b pb-4">Our Commitment</h2>
                   {valueItem.long_description ? (
                       <div className="whitespace-pre-line text-lg">
                           {valueItem.long_description}
                       </div>
                   ) : (
                       <p className="italic text-gray-500">No detailed description available.</p>
                   )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                {/* Other Values Card */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-[#0B1B3D] mb-6 flex items-center gap-2">
                     <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                     {headings?.our_values_title || "Other Values"}
                  </h3>
                  <div className="space-y-4">
                    {otherValues.map(val => (
                      <Link 
                        key={val.id} 
                        to={`/our-values/${val.id}`}
                        className="group flex items-center justify-between p-3 rounded-xl bg-white border border-transparent hover:border-primary/20 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                             {val.icon ? <DynamicIcon name={val.icon} className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                           </div>
                           <span className="font-bold text-[#0B1B3D] group-hover:text-primary transition-colors">
                             {val.title}
                           </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                  <Link 
                    to="/our-values" 
                    className="mt-8 block text-center py-3 rounded-xl bg-[#0B1B3D] text-white font-bold hover:bg-primary transition-all duration-300 uppercase text-xs tracking-widest"
                  >
                    View All Values
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
