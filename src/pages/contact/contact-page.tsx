"use client";

import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { ContactFormSection } from '@/components/website/contact-form-section'
import { ContactBranchesSection } from '@/components/website/contact-branches-section'
import { ContactMapSection } from '@/components/website/contact-map-section'
import { useGetContactPageBannerQuery } from '@/services/contactPageApi'

export default function ContactPage() {
  const { data } = useGetContactPageBannerQuery();
  const banner = data?.data;

  // Default values if no banner data
  const backgroundImage = banner?.background_image || "/hero1.png";
  const overlayOpacity = banner?.opacity ? parseFloat(banner.opacity) : 0.4;
  const heading = "Contact Us";

  return (
    <div className="w-full">
      {/* Hero Section - Dynamic from API */}
      <PageHeroSection 
        image={backgroundImage} 
        heading={heading} 
        alt="Contact Us Hero"
        overlayOpacity={overlayOpacity}
      />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Contact Us" />
      
      {/* Branches Section */}
      <ContactBranchesSection />
      
      {/* Contact Form Section - Animated */}
      <ContactFormSection />
      
      {/* Map Section */}
      <ContactMapSection />
    </div>
  )
}

