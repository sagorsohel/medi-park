import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { WhoWeAreSection } from '@/components/website/who-we-are-section'
import { MissionVisionSection } from '@/components/website/mission-vision-section'
import { TransformingHealthcareSection } from '@/components/website/transforming-healthcare-section'
import { MRCPPACESSection } from '@/components/website/mrcp-paces-section'

export default function AboutPage() {
  const missionData = {
    title: "Our Mission",
    image: "/about3.png",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    alt: "Our Mission"
  };

  const visionData = {
    title: "Our Vision",
    image: "/about-2.png",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    alt: "Our Vision"
  };

  return (
    <div className="w-full">
      {/* Hero Section - Only Image */}
      <PageHeroSection image="/hero1.png" heading="About Us" alt="About Us Hero" />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="About Us" />
      
      {/* Who We Are Section */}
      <WhoWeAreSection />
      
      {/* Mission & Vision Section */}
      <MissionVisionSection mission={missionData} vision={visionData} />
      
      {/* Transforming Healthcare Section */}
      <TransformingHealthcareSection
        title="Transforming Healthcare in Bangladesh"
        images={[
          "/about1.png",
          "/about-2.png",
          "/about3.png",
          "/about1.png"
        ]}
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
      />
      
      {/* MRCP PACES Section */}
      <MRCPPACESSection
        title="The first MRCP (UK) PACES examination center in Bangladesh"
        image="/about-2.png"
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
        alt="MRCP PACES examination center"
      />
    </div>
  )
}

