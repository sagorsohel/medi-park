import { useParams } from "react-router";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { Card, CardContent } from '@/components/ui/card'

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();

  // In a real app, this would be fetched from an API based on the id
  const blogPost = {
    id: id || "1",
    title: "Is COPD Curable? Understanding Treatments That Help Manage the Disease",
    mainImage: "/hero1.png",
    author: {
      name: "Dr. SM Abdullah Al Mamun",
      image: "/hero2.png",
      role: "Author"
    },
    content: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    ]
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading={blogPost.title} alt={`${blogPost.title} Hero`} />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage={blogPost.title} />
      
      {/* Blog Detail Content */}
      <section className="w-full bg-white">
        {/* Dark Blue Header */}
        <div className="w-full bg-blue-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              {blogPost.title}
            </h1>
          </div>
        </div>

        {/* Main Image Section */}
        <div className="w-full">
          <img
            src={blogPost.mainImage}
            alt={blogPost.title}
            className="w-full h-auto object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/vite.svg";
            }}
          />
        </div>

        {/* Author Byline */}
        <div className="w-full bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="w-fit">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={blogPost.author.image}
                      alt={blogPost.author.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/vite.svg";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{blogPost.author.name}</p>
                    <p className="text-sm text-gray-600">{blogPost.author.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full bg-white pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 text-gray-700">
              {blogPost.content.map((paragraph, index) => (
                <p key={index} className="text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

