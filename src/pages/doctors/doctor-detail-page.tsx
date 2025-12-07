import { useParams } from "react-router";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { Card, CardContent } from '@/components/ui/card'

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();

  // In a real app, this would be fetched from an API based on the id
  const doctor = {
    id: id || "1",
    image: "/hero1.png",
    name: "Dr. Muhammad Hasan Andalib",
    qualifications: "MBBS (DMC), MRCP (London, UK), FRCP (Edin)",
    role: "Coordinator & Senior Consultant",
    department: "Accident & Emergency",
    areasOfExpertise: [
      "More than 20 years of clinical experience.",
      "Obtained his MBBS from Dhaka Medical College and completed his Internship in Dhaka Medical College Hospital.",
      "Worked in UK (London, Essex, Kent) after completion of PLAB examination and worked in different hospitals in Acute Medicine, General Internal Medicine and Intensive care as Senior Clinical Fellow and Specialist Registrar under National Health Service. He also worked in different medical positions in Bangladesh.",
      "Worked in Emergency Medicine for about a decade.",

    ]
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading={'Doctor'} alt={`${doctor.name} Hero`} />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage={doctor.name} />

      {/* Doctor Detail Content */}
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-blue-900 p-0">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Image */}
                <div className="shrink-0">
                  <div className="sm:w-64 w-full h-64 rounded-lg overflow-hidden border-4 border-gray-200">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/vite.svg";
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-primary mb-3">
                        {doctor.name}
                      </h1>
                      <p className="text-gray-600 mb-2">{doctor.qualifications}</p>
                      <p className="text-lg font-semibold text-gray-900 mb-2">{doctor.role}</p>
                      <p className="text-blue-600 underline">{doctor.department}</p>
                    </div>
                    {/* Logo */}
                    <div className="hidden md:block">
                      <div className="flex items-center gap-2">
                        <img src="/color-logo.png" className="object-cover " alt="" />
                      </div>
                    </div>
                  </div>

                  {/* Areas of Expertise */}
                  <div className="">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Areas of expertise</h2>
                    <ul className="flex flex-col gap-1 text-gray-700">
                      {doctor.areasOfExpertise.map((expertise, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span>{expertise}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

