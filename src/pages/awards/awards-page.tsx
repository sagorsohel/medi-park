import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { AwardCarouselSection } from '@/components/website/award-carousel-section'
import { OurAchievementSection } from '@/components/website/our-achievement-section'

export default function AwardsPage() {
  const certificates = [
    {
      id: 1,
      title: "Certificate of Achievement",
      recipient: "MediPark",
      description: "This certificate acknowledges your outstanding contribution and dedication to the Design project, showcasing your commitment to excellence, innovation, and teamwork.",
      date: "10 Oct 2024",
      image: "/award1.png"
    },
    {
      id: 2,
      title: "Certificate of Achievement",
      recipient: "MediPark",
      description: "This certificate acknowledges your outstanding contribution and dedication to the Design project, showcasing your commitment to excellence, innovation, and teamwork.",
      date: "15 Nov 2024",
      image: "/award2.png"
    },
    {
      id: 3,
      title: "Certificate of Achievement",
      recipient: "MediPark",
      description: "This certificate acknowledges your outstanding contribution and dedication to the Design project, showcasing your commitment to excellence, innovation, and teamwork.",
      date: "20 Dec 2024",
      image: "/award1.png"
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading="Awards" alt="Awards Hero" />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Awards" />
      
      {/* Award Carousel Section */}
      <AwardCarouselSection
        title="Award"
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
        certificates={certificates}
      />
      
      {/* Our Achievement Section */}
      <OurAchievementSection
        title="Our Achievement"
        images={[
          "/about1.png",
          "/about-2.png",
          "/about3.png"
        ]}
        text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
      />
    </div>
  )
}

