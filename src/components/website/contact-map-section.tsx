"use client";
import { useGetBranchesQuery } from "@/services/contactPageApi";
import { useMemo } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function ContactMapSection() {
  const { data: branchesData } = useGetBranchesQuery();
  
  // Find the main branch
  const mainBranch = useMemo(() => {
    if (!branchesData?.data) return null;
    return branchesData.data.find(branch => branch.is_main === 1) || branchesData.data[0];
  }, [branchesData]);

  // Coordinates for Forest Hills, Queens, NY (based on the map image or use mainBranch if available)
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.5!2d90.42!3d23.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ5JzEyLjAiTiA5MMKwMjUnMTIuMCJF!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`;

  return (
    <div className="w-full bg-white relative">
      <div className="w-full">
        <div className="w-full h-[500px] md:h-[650px] overflow-hidden relative">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Medipark Location"
            className="w-full h-full"
          />

          {/* Contact Info Overlay */}
          <div className="absolute top-10 left-4 md:left-10 lg:left-20 max-w-[380px] w-full bg-[#0B1B3D] text-white p-8 md:p-10 shadow-2xl z-10 rounded-sm">
            <h2 className="text-2xl font-bold mb-8 border-l-4 border-primary pl-4 uppercase tracking-wide">Get In Touch</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-primary/20 p-3 rounded-full h-fit mt-1">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 uppercase text-primary tracking-tight">Visit Us</h3>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {mainBranch?.address || "MediPark Hospital Dhaka, Plot # 81, Block-E,\nBashundhara R/A, Dhaka 1229, Bangladesh"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary/20 p-3 rounded-full h-fit mt-1">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 uppercase text-primary tracking-tight">Call Us</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {mainBranch?.phone || "10633"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary/20 p-3 rounded-full h-fit mt-1">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 uppercase text-primary tracking-tight">Email Us</h3>
                  <p className="text-gray-300 text-sm leading-relaxed break-all">
                    {mainBranch?.email || "info@mediparkhospital.com"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-2 border-t border-white/10 mt-6">
                <div className="bg-primary/20 p-3 rounded-full h-fit mt-1">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 uppercase text-primary tracking-tight">Open 24/7</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Emergency services always available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

