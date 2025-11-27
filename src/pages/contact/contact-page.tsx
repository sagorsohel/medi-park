import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { ContactFormSection } from '@/components/website/contact-form-section'
import { ContactMapSection } from '@/components/website/contact-map-section'

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading="Contact Us" alt="Contact Us Hero" />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Contact Us" />
      
      {/* Contact Form Section */}
      <ContactFormSection />
      
      {/* Map Section */}
      <ContactMapSection />
    </div>
  )
}

