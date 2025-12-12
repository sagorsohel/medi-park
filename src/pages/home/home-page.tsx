import { HeroSection } from '@/components/website/hero-section'
import { AboutSection } from '@/components/website/about-section'
import { SpecialitiesSection } from '@/components/website/specialities-section'
import { DoctorsSection } from '@/components/website/doctors-section'
import { InvestorSection } from '@/components/website/investor-section'
import { PricingSection } from '@/components/website/pricing-section'
import { MediaSection } from '@/components/website/media-section'
import { CTASection } from '@/components/website/cta-section'
import { BlogSection } from '@/components/website/blog-section'
import { useEffect } from 'react'
import { store } from '@/store'
import { homepageApi } from '@/services/homepageApi'

export default function HomePage() {
  // Prefetch hero sections data on mount to show immediately
  useEffect(() => {
    store.dispatch(homepageApi.endpoints.getHeroSectionsPublic.initiate());
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section with Auto-Slider */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Specialities Section */}
      <SpecialitiesSection />

      {/* Doctors Section */}
      <DoctorsSection />



      {/* Pricing Section */}
      <PricingSection />

      {/* Media/News Section */}
      <MediaSection />

      {/* CTA Section */}
      <CTASection />

      {/* Blog Section */}
      <BlogSection />
      {/* Investor Section */}
      <InvestorSection />
    </div>
  )
}
