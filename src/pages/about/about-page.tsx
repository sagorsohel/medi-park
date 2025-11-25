import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { WhoWeAreSection } from '@/components/website/who-we-are-section'

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section - Only Image */}
      <PageHeroSection image="/hero1.png" alt="About Us Hero" />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="About Us" />
      
      {/* Who We Are Section */}
      <WhoWeAreSection />
    </div>
  )
}

