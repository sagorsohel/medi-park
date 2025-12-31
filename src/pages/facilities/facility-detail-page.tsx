"use client";

import { useParams, useNavigate } from "react-router";
import { useGetFacilityByIdQuery } from "@/services/homepageApi";
import { useGetDoctorsQuery } from "@/services/doctorApi";
import { useGetBlogsPublicQuery } from "@/services/blogApi";
import { PageHeroSection } from "@/components/website/page-hero-section";
import { BreadcrumbSection } from "@/components/website/breadcrumb-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

export default function FacilityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const facilityId = id ? parseInt(id) : 0;
  const [openAccordions, setOpenAccordions] = useState<Set<number>>(new Set());

  const { data: facilityData, isLoading } = useGetFacilityByIdQuery(facilityId);
  const { data: doctorsData } = useGetDoctorsQuery(1);
  const { data: blogsData } = useGetBlogsPublicQuery(1);
console.log(facilityData);
  const facility = facilityData?.data;
  console.log(facility);
  // Filter doctors by facility or department
  const facilityDoctors = useMemo(() => {
    if (!doctorsData?.data || !facility) return [];
    
    interface DoctorItem {
      id: number;
      image: string;
      name: string;
      role: string;
      department: string;
    }
    
    // If facility has assigned doctors, use those
    if (facility.doctors && Array.isArray(facility.doctors) && facility.doctors.length > 0) {
      return facility.doctors
        .map((doc: unknown): DoctorItem | null => {
          const doctorObj = typeof doc === 'object' && doc !== null ? doc as Record<string, unknown> : null;
          if (!doctorObj || typeof doctorObj.id !== 'number') return null;
          return {
            id: doctorObj.id,
            image: (typeof doctorObj.image === 'string' ? doctorObj.image : "/vite.svg"),
            name: (typeof doctorObj.doctor_name === 'string' ? doctorObj.doctor_name : typeof doctorObj.name === 'string' ? doctorObj.name : ""),
            role: (typeof doctorObj.role === 'string' ? doctorObj.role : "Consultant"),
            department: (typeof doctorObj.department === 'string' ? doctorObj.department : typeof doctorObj.specialist === 'string' ? doctorObj.specialist : facility.title),
          };
        })
        .filter((doctor): doctor is DoctorItem => doctor !== null);
    }
    
    // Otherwise, try to match by department
    return doctorsData.data
      .filter((doctor) => 
        doctor.department?.toLowerCase().includes(facility.title.toLowerCase()) ||
        facility.title.toLowerCase().includes(doctor.department?.toLowerCase() || "")
      )
      .slice(0, 6)
      .map((doctor) => ({
        id: doctor.id,
        image: doctor.image || "/vite.svg",
        name: doctor.doctor_name || "",
        role: doctor.specialist || "Consultant",
        department: doctor.department || doctor.specialist || facility.title,
      }));
  }, [doctorsData, facility]);

  // Get related blogs
  const relatedBlogs = useMemo(() => {
    if (!blogsData?.data || !facility) return [];
    
    interface BlogItem {
      id: number;
      title: string;
      feature_image: string;
      description: string;
      author_name: string;
      created_at: string;
    }
    
    // If facility has assigned blogs, use those
    if (facility.blogs && Array.isArray(facility.blogs) && facility.blogs.length > 0) {
      return facility.blogs
        .map((blog: unknown): BlogItem | null => {
          const blogObj = typeof blog === 'object' && blog !== null ? blog as Record<string, unknown> : null;
          if (!blogObj || typeof blogObj.id !== 'number') return null;
          return {
            id: blogObj.id,
            title: (typeof blogObj.title === 'string' ? blogObj.title : ""),
            feature_image: (typeof blogObj.feature_image === 'string' ? blogObj.feature_image : "/vite.svg"),
            description: (typeof blogObj.description === 'string' ? blogObj.description : ""),
            author_name: (typeof blogObj.author_name === 'string' ? blogObj.author_name : ""),
            created_at: (typeof blogObj.created_at === 'string' ? blogObj.created_at : ""),
          };
        })
        .filter((blog): blog is BlogItem => blog !== null)
        .slice(0, 6);
    }
    
    // Otherwise, return recent blogs
    return blogsData.data.slice(0, 6).map((blog) => ({
      id: blog.id,
      title: blog.title || "",
      feature_image: blog.feature_image || "/vite.svg",
      description: blog.description || "",
      author_name: blog.author_name || "",
      created_at: blog.created_at || "",
    }));
  }, [blogsData, facility]);

  const toggleAccordion = (index: number) => {
    setOpenAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Facility not found</h2>
          <Button onClick={() => navigate("/facilities")}>Back to Facilities</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection 
        image={facility.image} 
        heading={facility.title} 
        alt={`${facility.title} Hero`} 
      />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage={facility.title} />

      {/* Main Content */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title Section */}
          <div className="mb-0 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {facility.title}
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-700 font-medium">
              {facility.title} At MediPark Specialized Hospital
            </h2>
          </div>

          {/* Description Section */}
          <div className="mb-12">
            {facility.short_description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              >
                <div dangerouslySetInnerHTML={{ __html: facility.short_description }} />
              </motion.div>
            )}

            {facility.description1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed mt-6"
              >
                <div dangerouslySetInnerHTML={{ __html: facility.description1 }} />
              </motion.div>
            )}

         
          </div>

          {/* Conditions Treated / Accordions Section */}
          {facility.accordions && facility.accordions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Conditions Treated
              </h2>
              <div className="space-y-2">
                {facility.accordions.map((accordion, index) => (
                  <Collapsible
                    key={index}
                    open={openAccordions.has(index)}
                    onOpenChange={() => toggleAccordion(index)}
                  >
                    <div className="border border-gray-200 rounded-md mb-2 bg-white hover:bg-gray-50 transition-colors">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4">
                          <h3 className="font-semibold text-left text-gray-900 text-lg">
                            {accordion.title}
                          </h3>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 transition-transform duration-200 shrink-0 ${
                              openAccordions.has(index) ? 'transform rotate-180' : ''
                            }`}
                          />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                        <div className="px-4 pb-4 border-t border-gray-100">
                          <div 
                            className="text-gray-700 prose max-w-none pt-4"
                            dangerouslySetInnerHTML={{ __html: accordion.description }}
                          />
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            </motion.div>
          )}

          {/* List of Doctors Section */}
          {facilityDoctors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <div className="mb-6 text-center py-5">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  List of Doctors
                </h2>
                <p className="text-gray-600">
                  We can help you choose top specialists from our pool of expert doctors, physicians and surgeons.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {facilityDoctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-3 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/vite.svg";
                            }}
                          />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {doctor.role}
                        </p>
                        <p className="text-sm text-primary font-medium mb-4">
                          {doctor.department}
                        </p>
                        <Button
                          variant="outline"
                          className="w-full"
                          asChild
                        >
                          <Link to={`/doctors/${doctor.id}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          <div>
          {facility.description2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed mt-6"
              >
                <div dangerouslySetInnerHTML={{ __html: facility.description2 }} />
              </motion.div>
            )}
          </div>

          {/* Important Points Section */}
          {facility.footer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                IMPORTANT POINTS ABOUT TESTS/PROCEDURES/SURGERIES, YOUR REPORTS & BILLING ENQUIRIES
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <div dangerouslySetInnerHTML={{ __html: facility.footer }} />
              </div>
            </motion.div>
          )}

          {/* Related Blogs Section */}
          {relatedBlogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Related Blogs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.map((blog) => (
                  <Card
                    key={blog.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                    onClick={() => navigate(`/blogs/${blog.id}`)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.feature_image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/vite.svg";
                        }}
                      />
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">
                        {blog.title}
                      </h3>
                      {blog.description && (
                        <div 
                          className="text-sm text-gray-600 line-clamp-3 prose max-w-none mb-4 flex-1"
                          dangerouslySetInnerHTML={{ 
                            __html: blog.description.length > 150 
                              ? blog.description.substring(0, 150) + '...' 
                              : blog.description 
                          }}
                        />
                      )}
                      {blog.author_name && (
                        <p className="text-xs text-gray-500 mb-2">
                          By {blog.author_name}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="w-full mt-auto"
                        asChild
                      >
                        <Link to={`/blogs/${blog.id}`}>
                          Read More
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Billing Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-50 rounded-lg p-6 border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              For queries on charges, contact our Billing Department
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">Billing Department</p>
              <p>MediPark Specialized Hospital</p>
              <p>Phone: <a href="tel:+8801234567890" className="text-primary hover:underline">+880 1234 567890</a></p>
              <p>Email: <a href="mailto:billing@medipark.com" className="text-primary hover:underline">billing@medipark.com</a></p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
