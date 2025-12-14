import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { DoctorProfileCard } from '@/components/website/doctor-profile-card'
import { User, Loader2 } from 'lucide-react'
import { useGetDoctorsQuery } from '@/services/doctorApi'
import { useMemo } from 'react'

export default function DoctorsPage() {
  const { data, isLoading } = useGetDoctorsQuery(1);

  // Group doctors by department
  const departments = useMemo(() => {
    if (!data?.data) return [];

    const departmentMap = new Map<string, {
      id: number;
      name: string;
      icon: JSX.Element;
      doctors: Array<{
        id: number;
        image: string;
        name: string;
        qualifications: string;
        role: string;
        department: string;
      }>;
    }>();

    data.data.forEach((doctor, index) => {
      const deptName = doctor.department || "Other";
      
      // Format qualifications from education array
      let qualifications = "";
      if (doctor.education && Array.isArray(doctor.education) && doctor.education.length > 0) {
        qualifications = doctor.education
          .map(edu => {
            const parts = [];
            if (edu.qualification) parts.push(edu.qualification);
            if (edu.institute_name) parts.push(`(${edu.institute_name})`);
            return parts.join(" ");
          })
          .filter(q => q)
          .join(", ");
      }
      
      if (!qualifications && doctor.specialist) {
        qualifications = doctor.specialist;
      }

      const doctorData = {
        id: doctor.id,
        image: doctor.image || "/vite.svg",
        name: doctor.doctor_name || "Doctor",
        qualifications: qualifications || "Medical Professional",
        role: doctor.specialist || "Consultant",
        department: deptName,
      };

      if (!departmentMap.has(deptName)) {
        departmentMap.set(deptName, {
          id: departmentMap.size + 1,
          name: deptName,
          icon: <User className="h-6 w-6" />,
          doctors: [],
        });
      }

      departmentMap.get(deptName)!.doctors.push(doctorData);
    });

    return Array.from(departmentMap.values());
  }, [data]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading="Our Doctors" alt="Our Doctors Hero" />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Our Doctors" />

      {/* Doctors by Department */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No doctors available at the moment.
            </div>
          ) : (
            departments.map((department) => (
            <div key={department.id} className="mb-16 last:mb-0">
              {/* Department Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="text-primary">
                    {department.icon}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-primary">
                    {department.name}
                  </h2>
                </div>
                <div className="px-4 py-2 rounded-full border-2 border-blue-900 bg-blue-50">
                  <span className="text-primary font-semibold">
                    {department.doctors.length} {department.doctors.length === 1 ? 'Doctor' : 'Doctors'}
                  </span>
                </div>
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
            ))
          )}
        </div>
      </section>
    </div>
  )
}

