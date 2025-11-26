import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { DoctorProfileCard } from '@/components/website/doctor-profile-card'
import { User } from 'lucide-react'

export default function DoctorsPage() {
  // Sample doctors data organized by department
  const departments = [
    {
      id: 1,
      name: "Accident & Emergency",
      icon: <User className="h-6 w-6" />,
      doctors: [
        {
          id: 1,
          image: "/hero1.png",
          name: "Dr. Muhammad Hasan Andalib",
          qualifications: "MBBS (DMC), MRCP (London, UK), FRCP (Edin)",
          role: "Coordinator & Senior Consultant",
          department: "Accident & Emergency"
        }
      ]
    },
    {
      id: 2,
      name: "Anesthesia and Pain Medicine",
      icon: <User className="h-6 w-6" />,
      doctors: [
        {
          id: 2,
          image: "/hero2.png",
          name: "Dr. Abu Naser Muhammad Badruddoza",
          qualifications: "MBBS, FCPS (Anaesthesia)",
          role: "Senior Consultant",
          department: "Anesthesia and Pain Medicine"
        },
        {
          id: 3,
          image: "/hero3.png",
          name: "Dr. Md. Aftab Uddin",
          qualifications: "MBBS, DA, FCPS (Anesthesiology)",
          role: "Consultant",
          department: "Anesthesia and Pain Medicine"
        },
        {
          id: 4,
          image: "/hero4.png",
          name: "Dr. Abu Naser Muhammad Badruddoza",
          qualifications: "MBBS, FCPS (Anaesthesia)",
          role: "Senior Consultant",
          department: "Anesthesia and Pain Medicine"
        },
        {
          id: 5,
          image: "/hero1.png",
          name: "Dr. Md. Aftab Uddin",
          qualifications: "MBBS, DA, FCPS (Anesthesiology)",
          role: "Consultant",
          department: "Anesthesia and Pain Medicine"
        },
        {
          id: 6,
          image: "/hero2.png",
          name: "Dr. Abu Naser Muhammad Badruddoza",
          qualifications: "MBBS, FCPS (Anaesthesia)",
          role: "Senior Consultant",
          department: "Anesthesia and Pain Medicine"
        },
        {
          id: 7,
          image: "/hero3.png",
          name: "Dr. Md. Aftab Uddin",
          qualifications: "MBBS, DA, FCPS (Anesthesiology)",
          role: "Consultant",
          department: "Anesthesia and Pain Medicine"
        }
      ]
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading="Our Doctors" alt="Our Doctors Hero" />
      
      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Our Doctors" />
      
      {/* Doctors by Department */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {departments.map((department) => (
            <div key={department.id} className="mb-16 last:mb-0">
              {/* Department Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-blue-900">
                    {department.icon}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
                    {department.name}
                  </h2>
                </div>
                <div className="px-4 py-2 rounded-full border-2 border-blue-900 bg-blue-50">
                  <span className="text-blue-900 font-semibold">
                    {department.doctors.length} {department.doctors.length === 1 ? 'Doctor' : 'Doctors'}
                  </span>
                </div>
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {department.doctors.map((doctor) => (
                  <DoctorProfileCard
                    key={doctor.id}
                    id={doctor.id}
                    image={doctor.image}
                    name={doctor.name}
                    qualifications={doctor.qualifications}
                    role={doctor.role}
                    department={doctor.department}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

