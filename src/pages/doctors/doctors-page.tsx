import React, { useMemo, useState } from 'react'
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { DoctorProfileCard } from '@/components/website/doctor-profile-card'
import { User, Search } from 'lucide-react'
import { useGetDoctorsQuery } from '@/services/doctorApi'
import { Input } from "@/components/ui/input";
import { useDebounce } from '@/hooks/use-debounce';
import { DoctorSkeleton } from '@/components/website/doctor-profile-card';
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const { data, isLoading, isFetching } = useGetDoctorsQuery({ 
    search: debouncedSearch,
    page: currentPage 
  });

  // Reset to page 1 when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Group doctors by department
  const filteredDepartments = useMemo(() => {
    if (!data?.data) return [];

    const departmentMap = new Map<string, {
      id: number;
      name: string;
      icon: React.ReactElement;
      doctors: Array<{
        id: number;
        image: string;
        name: string;
        qualifications: string;
        role: string;
        department: string;
      }>;
    }>();

    data.data.forEach((doctor) => {
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

  const pagination = data?.pagination;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <PageHeroSection image="/hero1.png" heading="Our Doctors" alt="Our Doctors Hero" />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage="Our Doctors" />

      {/* Doctors List Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Our Expert Doctors
            </h1>

            {/* Search Bar */}
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search by name or department..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="pl-10 h-12 border-gray-200 shadow-sm focus:border-primary focus:ring-primary rounded-xl"
              />
            </div>
          </div>

          {(isLoading || isFetching) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <DoctorSkeleton key={i} />
              ))}
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
               <p className="text-gray-500 text-lg font-medium">
                 {searchTerm ? `No doctors matching "${searchTerm}" found.` : "No doctors available."}
               </p>
               {searchTerm && (
                 <button 
                    className="mt-2 text-primary font-bold hover:underline"
                    onClick={() => setSearchTerm("")}
                 >
                   Clear search filters
                 </button>
               )}
            </div>
          ) : (
            <>
              {filteredDepartments.map((department) => (
                <div key={department.id} className="mb-16 last:mb-0">
                  {/* Department Header */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-gray-100/80">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        {department.icon}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-[#0B1B3D]">
                        {department.name}
                      </h2>
                    </div>
                    <div className="px-5 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                      <span className="text-primary font-black text-sm">
                        {department.doctors.length} {department.doctors.length === 1 ? 'DOCTOR' : 'DOCTORS'}
                      </span>
                    </div>
                  </div>

                  {/* Doctors Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

              {/* Pagination */}
              {pagination && pagination.total_page > 1 && (
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <DataTablePagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_page}
                    totalEntries={pagination.total_count}
                    entriesPerPage={pagination.per_page}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

