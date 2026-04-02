"use client";
import { useGetAboutUsSectionPublicQuery } from "@/services/homepageApi";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
  const { data } = useGetAboutUsSectionPublicQuery();
  const section = data?.data;

  // Only render if we have cached data
  if (!section) return null;

  const features = section.features?.length ? section.features : [
    "Seamless Care",
    "Patient-Centered Care",
    "Warm and Welcoming Environment",
    "Personalized Approach",
    "Comprehensive Care",
    "Cutting-Edge Technology",
    "Expert Doctors",
    "Positive Reviews",
  ];

  return (
    <div className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Title / Subtitle */}

            <h2 className="text-4xl  font-semibold text-primary mb-6 leading-tight">
              {section.title || "We Provide Finnest Patient's Care & Amenities"}
            </h2>

            {/* Main Content */}
            <div className="text-gray-600 text-lg mb-8 leading-relaxed">
              {section.content ? (
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              ) : (
                <p>
                  Embrace a world of comprehensive healthcare where your well-being takes center
                  stage. At Meca, we're dedicated to providing you with personalized and
                  compassionate medical services.
                </p>
              )}
            </div>
            <h4 className="text-black font-normal  tracking-wider mb-3 text-lg">
              {section.sub_title || "ABOUT US"}
            </h4>
            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-[#0B1B3D] font-medium text-[16px]">
                  <svg className="w-5 h-5 mr-3 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 13.5L6 17L14 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.5 13.5L14 17L22 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>



            {/* CTA Button */}
            <Link to="/about">
              <button className="bg-primary hover:bg-primary/80 text-white px-7 py-3.5 rounded-full flex gap-3 items-center font-semibold text-lg transition-colors shadow-sm">
                <span className="bg-white text-primary rounded-full p-1.5 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" strokeWidth={3} />
                </span>
                More About Us
              </button>
            </Link>
          </motion.div>

          {/* Right Column - Image & Floating Cards */}
          <motion.div
            className="relative lg:ml-10 mt-10 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Top Right Floating Image */}
            {section.image_2 && (
              <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 z-20 rounded-3xl  border-4 border-primary shadow-sm w-40 sm:w-48 bg-white overflow-hidden aspect-square">
                <img
                  src={section.image_2}
                  alt="About Us Feature 2"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/vite.svg";
                  }}
                />
              </div>
            )}

            {/* Main Image */}
            <div className="relative z-10 rounded-[40px] overflow-hidden shadow-lg h-[450px] sm:h-[600px] w-full bg-gray-100">
              <img
                src={section.image_1}
                alt="Finest Patient Care"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/vite.svg";
                }}
              />
            </div>

            {/* Bottom Left Floating Image */}
            {section.image_3 && (
              <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 z-20 rounded-3xl  border-4 border-primary shadow-sm w-40 sm:w-48 bg-white overflow-hidden aspect-square">
                <img
                  src={section.image_3}
                  alt="About Us Feature 3"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/vite.svg";
                  }}
                />
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}

