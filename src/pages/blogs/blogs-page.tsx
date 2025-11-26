import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { BlogCard } from '@/components/website/blog-card'

export default function BlogsPage() {
  // Generate 20 blog posts
  const blogPosts = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    image: i % 4 === 0 ? "/hero1.png" : i % 4 === 1 ? "/hero2.png" : i % 4 === 2 ? "/hero3.png" : "/hero4.png",
    date: "09 November 2025",
    title: "Successful Treatment of a Child's Congenital Heart Defect by Dr. Taher",
    link: `/blogs/${i + 1}`
  }));

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading="Blogs" alt="Blogs Hero" />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Blogs" />
      
      {/* Blogs Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                image={blog.image}
                date={blog.date}
                title={blog.title}
                link={blog.link}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

