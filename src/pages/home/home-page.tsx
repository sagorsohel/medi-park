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
import { VideoSection } from '@/components/website/video-section'
import { ContactMapSection } from '@/components/website/contact-map-section'
import { useGetHeadingsQuery } from '@/services/headingApi'

export default function HomePage() {
  const { data: headingsData } = useGetHeadingsQuery();
  const headings = headingsData?.data;

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
      <DoctorsSection title={headings?.homepage_doctor_section_title} />



      {/* Pricing Section */}
      <PricingSection />

      {/* Media/News Section */}
      <MediaSection title={headings?.homepage_news_and_media_section_title} />

      {/* CTA Section */}
      <CTASection />

      {/* Blog Section */}
      <BlogSection title={headings?.homepage_health_insight_section_title} />
      <VideoSection />
      {/* Investor Section */}
      <InvestorSection title={headings?.homepage_our_legacy_partner_section_title} />
      <ContactMapSection />
    </div>
  )
}
