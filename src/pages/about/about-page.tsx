import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { WhoWeAreSection } from '@/components/website/who-we-are-section'
import { MissionVisionSection } from '@/components/website/mission-vision-section'
import { TransformingHealthcareSection } from '@/components/website/transforming-healthcare-section'
import { MRCPPACESSection } from '@/components/website/mrcp-paces-section'

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section - Only Image */}
      <PageHeroSection image="/hero1.png" heading="About Us" alt="About Us Hero" />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="About Us" />
      
      {/* Who We Are Section */}
      <WhoWeAreSection />
      
      {/* Mission & Vision Section */}
      <MissionVisionSection />
      
      {/* Transforming Healthcare Section */}
      <TransformingHealthcareSection />
      
      {/* MRCP PACES Section */}
      <MRCPPACESSection />
    </div>
  )
}

