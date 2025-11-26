import { useParams } from "react-router";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { NewsCard } from '@/components/website/news-card'

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();

  // In a real app, this would be fetched from an API based on the id
  const newsItem = {
    id: id || "1",
    title: "MRCP PACES Examination Conducted in Bangladesh",
    mainImage: "/hero1.png",
    date: "20 November 2025",
  };

  // Related news items
  const relatedNews = [
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
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading={newsItem.title} alt={`${newsItem.title} Hero`} />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage={newsItem.title} />
      
      {/* News Detail Content */}
      <section className="w-full bg-white">
        {/* Dark Blue Header */}
        <div className="w-full bg-blue-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              {newsItem.title}
            </h1>
          </div>
        </div>

        {/* Main Image Section */}
        <div className="w-full">
          <img
            src={newsItem.mainImage}
            alt={newsItem.title}
            className="w-full h-auto object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/vite.svg";
            }}
          />
        </div>

        {/* Content Cards Section */}
        <div className="w-full bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {relatedNews.map((news) => (
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
        </div>

        {/* Placeholder Text Sections */}
        <div className="w-full bg-white pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 text-gray-700">
              <p className="text-justify">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type 
                specimen book. It has survived not only five centuries, but also the leap into 
                electronic typesetting, remaining essentially unchanged.
              </p>
              <p className="text-justify">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type 
                specimen book. It has survived not only five centuries, but also the leap into 
                electronic typesetting, remaining essentially unchanged. It was popularised in 
                the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
                and more recently with desktop publishing software like Aldus PageMaker including 
                versions of Lorem Ipsum.
              </p>
              <p className="text-justify">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type 
                specimen book. It has survived not only five centuries, but also the leap into 
                electronic typesetting, remaining essentially unchanged.
              </p>
              <p className="text-justify">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                when an unknown printer took a galley of type and scrambled it to make a type 
                specimen book. It has survived not only five centuries, but also the leap into 
                electronic typesetting, remaining essentially unchanged. It was popularised in 
                the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
                and more recently with desktop publishing software like Aldus PageMaker including 
                versions of Lorem Ipsum.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

