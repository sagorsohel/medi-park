import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { NewsCard } from '@/components/website/news-card'

export default function NewsPage() {
  // Sample news data
  const newsItems = [
    {
      id: 1,
      image: "/hero1.png",
      date: "20 November 2025",
      title: "MRCP PACES Examination Conducted in Bangladesh",
      link: "/news/1"
    },
    {
      id: 2,
      image: "/hero2.png",
      date: "20 November 2025",
      title: "MRCP PACES Examination Conducted in Bangladesh",
      link: "/news/2"
    },
    {
      id: 3,
      image: "/hero3.png",
      date: "20 November 2025",
      title: "MRCP PACES Examination Conducted in Bangladesh",
      link: "/news/3"
    },
    {
      id: 4,
      image: "/hero4.png",
      date: "20 November 2025",
      title: "MRCP PACES Examination Conducted in Bangladesh",
      link: "/news/4"
    },
    {
      id: 5,
      image: "/hero1.png",
      date: "20 November 2025",
      title: "MRCP PACES Examination Conducted in Bangladesh",
      link: "/news/5"
    },
    {
      id: 6,
      image: "/hero2.png",
      date: "20 November 2025",
      title: "MRCP PACES Examination Conducted in Bangladesh",
      link: "/news/6"
    }
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading="News & Media" alt="News & Media Hero" />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="News & Media" />
      
      {/* News & Media Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              News & Media
            </h2>
            <div className="w-1 h-8 bg-blue-900 mx-auto"></div>
          </div>
          
          {/* Description */}
          <p className="text-gray-700 text-center mb-12 max-w-4xl mx-auto">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type 
            specimen book. It has survived not only five centuries, but also the leap into 
            electronic typesetting, remaining essentially unchanged.
          </p>
          
          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((news) => (
              <NewsCard
                key={news.id}
                image={news.image}
                date={news.date}
                title={news.title}
                link={news.link}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

