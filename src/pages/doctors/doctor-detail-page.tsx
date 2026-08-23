import { Link, useParams } from "react-router";
import { PageHeroSection } from '@/components/website/page-hero-section'
import { BreadcrumbSection } from '@/components/website/breadcrumb-section'
import { Card, CardContent } from '@/components/ui/card'
import { useGetDoctorByIdQuery } from '@/services/doctorApi'
import { Loader2, Calendar } from 'lucide-react'
import { useMemo } from 'react'

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const doctorId = id ? parseInt(id) : 0;
  const { data, isLoading, error } = useGetDoctorByIdQuery(doctorId, { skip: !doctorId });

  // Format doctor data for display
  const doctor = useMemo(() => {
    if (!data?.data) return null;

    const doctorData = data.data;

    // Safe parse helper
    const safeParseArray = (val: any) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return val.includes(",") ? val.split(",").map((s: string) => s.trim()) : [val];
        }
      }
      return [];
    };

    const parsedEducation = safeParseArray(doctorData.education);
    const parsedExperience = safeParseArray(doctorData.experience);
    const parsedAwards = safeParseArray(doctorData.awards);
    const parsedMembership = safeParseArray(doctorData.membership);
    const parsedLanguages = safeParseArray(doctorData.known_languages);

    // Format qualifications from education array
    let qualifications = "";
    if (parsedEducation.length > 0) {
      qualifications = parsedEducation
        .map(edu => {
          if (!edu) return "";
          if (typeof edu === "string") return edu;
          const parts = [];
          if (edu.qualification) parts.push(edu.qualification);
          if (edu.institute_name) parts.push(`(${edu.institute_name})`);
          return parts.join(" ");
        })
        .filter(Boolean)
        .join(", ");
    }

    // Build areas of expertise from about, experience, and education
    const areasOfExpertise: string[] = [];

    if (doctorData.about && typeof doctorData.about === "string") {
      areasOfExpertise.push(doctorData.about);
    }

    if (parsedExperience.length > 0) {
      parsedExperience.forEach((exp: any) => {
        if (!exp) return;
        if (typeof exp === "string") {
          areasOfExpertise.push(exp);
          return;
        }
        if (exp.hospital || exp.duration || exp.hospital_name || exp.designation) {
          const hosp = exp.hospital || exp.hospital_name || "medical center";
          const expText = `${exp.designation ? `${exp.designation} at ` : "Worked at "}${hosp}${exp.duration || exp.no_of_years ? ` for ${exp.duration || exp.no_of_years}` : ""}${exp.year ? ` (${exp.year})` : ""}`;
          areasOfExpertise.push(expText);
        }
      });
    }

    // Split about text into sentences if text is long
    if (doctorData.about && typeof doctorData.about === "string" && doctorData.about.includes('.')) {
      const sentences = doctorData.about.split('.').map(s => s.trim()).filter(Boolean);
      if (sentences.length > 0) {
        areasOfExpertise.length = 0;
        sentences.forEach(sentence => {
          areasOfExpertise.push(sentence + '.');
        });
      }
    }

    if (areasOfExpertise.length === 0) {
      areasOfExpertise.push("Experienced medical professional with extensive clinical expertise.");
    }

    return {
      ...doctorData,
      id: doctorData.id,
      image: doctorData.image || "/vite.svg",
      name: doctorData.doctor_name || "Doctor",
      qualifications: qualifications || doctorData.specialist || "Medical Professional",
      role: doctorData.specialist || "Consultant",
      department: doctorData.department || "General",
      education: parsedEducation,
      experience: parsedExperience,
      awards: parsedAwards,
      membership: parsedMembership,
      known_languages: parsedLanguages,
      areasOfExpertise,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full">
        <PageHeroSection image="/hero1.png" heading="Doctor" alt="Doctor Hero" />
        <BreadcrumbSection currentPage="Doctor" />
        <section className="w-full bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="w-full">
        <PageHeroSection image="/hero1.png" heading="Doctor" alt="Doctor Hero" />
        <BreadcrumbSection currentPage="Doctor" />
        <section className="w-full bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12 text-gray-500">
              Doctor not found or failed to load. Please try again later.
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <PageHeroSection image={doctor.image || "/hero1.png"} heading={'Doctor'} alt={`${doctor.name} Hero`} />

      {/* Breadcrumb Section */}
      <BreadcrumbSection currentPage={doctor.name} />

      {/* Doctor Detail Content */}
      <section className="w-full py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border border-slate-200 shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardContent className="p-6 sm:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Image */}
                <div className="shrink-0 w-full md:w-auto flex justify-center">
                  <div className="sm:w-64 w-full h-72 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md bg-slate-50">
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
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3D] mb-2 tracking-tight">
                        {doctor.name}
                      </h1>
                      {doctor.qualifications && (
                        <p className="text-slate-600 font-medium text-base mb-1">{doctor.qualifications}</p>
                      )}
                      <p className="text-lg font-bold text-primary mb-1">{doctor.role}</p>
                      <p className="text-sm font-semibold text-emerald-600 mb-5">{doctor.department}</p>

                      <Link
                        to="/appointment"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0B1B3D] hover:bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                      </Link>
                    </div>

                    {/* Logo */}
                    <div className="hidden md:block">
                      <div className="flex items-center gap-2">
                        <img src="/color-logo.png" className="object-contain h-12" alt="MediPark Logo" />
                      </div>
                    </div>
                  </div>

                  {/* Personal & Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                    {data?.data?.doctor_identity_number && (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Doctor ID</span>
                        <span className="text-gray-900 font-semibold text-sm mt-0.5">{data.data.doctor_identity_number}</span>
                      </div>
                    )}
                    {data?.data?.registration_number && (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registration No.</span>
                        <span className="text-gray-900 font-semibold text-sm mt-0.5">{data.data.registration_number}</span>
                      </div>
                    )}
                    {data?.data?.gender && (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gender</span>
                        <span className="text-gray-900 font-semibold text-sm mt-0.5 capitalize">{data.data.gender}</span>
                      </div>
                    )}
                    {data?.data?.mobile_number && (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile</span>
                        <span className="text-gray-900 font-semibold text-sm mt-0.5">{data.data.mobile_number}</span>
                      </div>
                    )}
                    {data?.data?.email_address && (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</span>
                        <span className="text-gray-900 font-semibold text-sm mt-0.5">{data.data.email_address}</span>
                      </div>
                    )}
                  </div>

                  {/* Addresses */}
                  {(data?.data?.present_address || data?.data?.permanent_address) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                      {data?.data?.present_address && (
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Present Address</span>
                          <span className="text-gray-800 text-sm whitespace-pre-line font-medium">{data.data.present_address}</span>
                        </div>
                      )}
                      {data?.data?.permanent_address && (
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Permanent Address</span>
                          <span className="text-gray-800 text-sm whitespace-pre-line font-medium">{data.data.permanent_address}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Areas of Expertise / About */}
                  {doctor.areasOfExpertise && doctor.areasOfExpertise.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-[#0B1B3D] mb-3">About & Expertise</h2>
                      <ul className="flex flex-col gap-2 text-gray-700">
                        {doctor.areasOfExpertise.map((expertise: string, index: number) => (
                          <li key={index} className="flex items-start text-sm leading-relaxed">
                            <span className="mr-2 text-primary font-bold">•</span>
                            <span>{expertise}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Known Languages */}
                  {doctor.known_languages && doctor.known_languages.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-[#0B1B3D] mb-3">Known Languages</h2>
                      <div className="flex flex-wrap gap-2">
                        {doctor.known_languages.map((lang: any, index: number) => {
                          const langText = typeof lang === 'string'
                            ? lang
                            : typeof lang === 'object' && lang
                            ? (lang.name || lang.title || lang.language || Object.values(lang).join(" "))
                            : String(lang);

                          return (
                            <span key={index} className="px-3.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wide">
                              {langText}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {doctor.education && doctor.education.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-[#0B1B3D] mb-4">Education</h2>
                      <ul className="flex flex-col gap-3">
                        {doctor.education.map((edu: any, index: number) => {
                          if (typeof edu === "string") {
                            return (
                              <li key={index} className="p-4 bg-slate-50 rounded-xl border-l-4 border-primary text-sm font-medium text-gray-800">
                                {edu}
                              </li>
                            );
                          }
                          return (
                            <li key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border-l-4 border-primary shadow-sm">
                              <div className="flex-1 space-y-1.5">
                                {edu.qualification && (
                                  <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                    <span className="text-xs font-bold text-primary min-w-[120px] uppercase">Qualification:</span>
                                    <span className="text-sm font-semibold text-gray-900">{edu.qualification}</span>
                                  </div>
                                )}
                                {edu.institute_name && (
                                  <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                    <span className="text-xs font-bold text-primary min-w-[120px] uppercase">Institute:</span>
                                    <span className="text-sm text-gray-700">{edu.institute_name}</span>
                                  </div>
                                )}
                                {edu.year && (
                                  <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                    <span className="text-xs font-bold text-primary min-w-[120px] uppercase">Year:</span>
                                    <span className="text-xs text-gray-600 font-medium">{edu.year}</span>
                                  </div>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Experience */}
                  {doctor.experience && doctor.experience.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-[#0B1B3D] mb-4">Experience</h2>
                      <ul className="flex flex-col gap-3">
                        {doctor.experience.map((exp: any, index: number) => {
                          if (typeof exp === "string") {
                            return (
                              <li key={index} className="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500 text-sm font-medium text-gray-800">
                                {exp}
                              </li>
                            );
                          }
                          return (
                            <li key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                              <div className="flex-1 space-y-1.5">
                                {(exp.designation || exp.title) && (
                                  <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                    <span className="text-xs font-bold text-emerald-600 min-w-[120px] uppercase">Designation:</span>
                                    <span className="text-sm font-semibold text-gray-900">{exp.designation || exp.title}</span>
                                  </div>
                                )}
                                {(exp.hospital || exp.hospital_name || exp.company) && (
                                  <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                    <span className="text-xs font-bold text-emerald-600 min-w-[120px] uppercase">Hospital/Org:</span>
                                    <span className="text-sm text-gray-700">{exp.hospital || exp.hospital_name || exp.company}</span>
                                  </div>
                                )}
                                {(exp.duration || exp.no_of_years) && (
                                  <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                    <span className="text-xs font-bold text-emerald-600 min-w-[120px] uppercase">Duration:</span>
                                    <span className="text-xs text-gray-600 font-medium">{exp.duration || exp.no_of_years}</span>
                                  </div>
                                )}
                                {exp.year && (
                                  <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                                    <span className="text-xs font-bold text-emerald-600 min-w-[120px] uppercase">Year:</span>
                                    <span className="text-xs text-gray-600 font-medium">{exp.year}</span>
                                  </div>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Awards */}
                  {doctor.awards && doctor.awards.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-[#0B1B3D] mb-4">Awards & Recognitions</h2>
                      <ul className="flex flex-col gap-3">
                        {doctor.awards.map((award: any, index: number) => {
                          const awardTitle = typeof award === 'string'
                            ? award
                            : typeof award === 'object' && award
                            ? (award.title || award.name || award.description || "Award")
                            : String(award);

                          const awardYear = typeof award === 'object' && award?.year ? award.year : null;
                          const awardDesc = typeof award === 'object' && award?.description && award.description !== awardTitle ? award.description : null;

                          return (
                            <li key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl shadow-sm border border-slate-100">
                              <span className="mt-0.5 text-amber-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                              </span>
                              <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm text-gray-900 font-bold">{awardTitle}</span>
                                  {awardYear && <span className="text-xs text-gray-500 font-medium">({awardYear})</span>}
                                </div>
                                {awardDesc && <p className="text-xs text-gray-600 mt-1">{awardDesc}</p>}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Membership */}
                  {doctor.membership && doctor.membership.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-[#0B1B3D] mb-4">Professional Memberships</h2>
                      <ul className="flex flex-col gap-3">
                        {doctor.membership.map((mem: any, index: number) => {
                          const memTitle = typeof mem === 'string'
                            ? mem
                            : typeof mem === 'object' && mem
                            ? (mem.title || mem.name || mem.organization || "Member")
                            : String(mem);

                          const memOrg = typeof mem === 'object' && mem?.organization && mem.organization !== memTitle ? mem.organization : null;
                          const memRole = typeof mem === 'object' && mem?.role ? mem.role : null;

                          return (
                            <li key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl shadow-sm border border-slate-100">
                              <span className="mt-0.5 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                              </span>
                              <div className="flex-1">
                                <span className="text-sm text-gray-900 font-bold">{memTitle}</span>
                                {(memOrg || memRole) && (
                                  <p className="text-xs text-gray-600 mt-0.5">
                                    {[memRole, memOrg].filter(Boolean).join(" - ")}
                                  </p>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Social Media Links */}
                  {data?.data?.social_media && typeof data.data.social_media === 'object' && !Array.isArray(data.data.social_media) && Object.keys(data.data.social_media).length > 0 && (
                    <div className="pt-6 mt-4 border-t border-gray-100">
                      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Connect with Doctor</h2>
                      <div className="flex items-center gap-3">
                        {data.data.social_media.facebook && (
                          <a href={data.data.social_media.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors bg-slate-50 p-2.5 rounded-full hover:bg-blue-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </a>
                        )}
                        {data.data.social_media.twitter && (
                          <a href={data.data.social_media.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors bg-slate-50 p-2.5 rounded-full hover:bg-blue-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                          </a>
                        )}
                        {data.data.social_media.linkedin && (
                          <a href={data.data.social_media.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors bg-slate-50 p-2.5 rounded-full hover:bg-blue-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
