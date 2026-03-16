import { AboutPageHero } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { WhoWeAreSection } from '@/components/website/who-we-are-section'
import { BoardOfDirectorsSection } from '@/components/website/board-of-directors-section'
import { MissionVisionSection } from '@/components/website/mission-vision-section'
import { TransformingHealthcareSection } from '@/components/website/transforming-healthcare-section'
import { MRCPPACESSection } from '@/components/website/mrcp-paces-section'
import { VideoSection } from '@/components/website/video-section'
import { useEffect } from 'react'
import { store } from '@/store'
import { aboutPageApi } from '@/services/aboutPageApi'

export default function AboutPage() {


  return (
    <div className="w-full">
      {/* Hero Section - Dynamic from API */}
      <AboutPageHero />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="About Us" />

      {/* Who We Are Section */}
      <WhoWeAreSection />

      {/* Video Section */}


      {/* Board of Directors Section */}
      <BoardOfDirectorsSection />

      {/* Mission & Vision Section */}
      <MissionVisionSection />

      {/* Transforming Healthcare Section */}
      <TransformingHealthcareSection />

      {/* MRCP PACES Section */}
      <MRCPPACESSection />
    </div>
  )
}

