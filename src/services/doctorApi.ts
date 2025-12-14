import { api } from "@/services/baseApi";

export interface Doctor {
  id: number;
  doctor_identity_number: string;
  doctor_name: string;
  department: string;
  specialist: string;
  email_address: string;
  mobile_number: string;
  gender: string | null;
  date_of_birth: string | null;
  known_languages: string | string[] | null;
  registration_number: string | null;
  about: string | null;
  image: string | null;
  present_address: string | null;
  permanent_address: string | null;
  education?: Array<{ institute_name?: string; qualification?: string; year?: string }>;
  experience?: Array<{ hospital_name?: string; no_of_years?: string; year?: string }>;
  social_media?: Array<{ title?: string; link?: string }>;
  membership?: Array<{ title?: string; description?: string; year?: string }>;
  awards?: Array<{ title?: string; description?: string; year?: string }>;
  created_at: string;
  updated_at: string;
}

export interface DoctorPagination {
  per_page: number;
  total_count: number;
  total_page: number;
  current_page: number;
  current_page_count: number;
  next_page: number | null;
  previous_page: number | null;
}

export interface DoctorsResponse {
  success: boolean;
  message: string;
  pagination: DoctorPagination;
  data: Doctor[];
}

export interface SingleDoctorResponse {
  success: boolean;
  message: string;
  data: Doctor;
}

export interface CreateDoctorPayload {
  doctor_name: string;
  department: string;
  specialist: string;
  email_address: string;
  mobile_number: string;
  gender?: string;
  date_of_birth?: string;
  known_languages?: string | string[];
  registration_number?: string;
  about?: string;
  image?: File | string;
  present_address?: string;
  permanent_address?: string;
  display_name?: string;
  username?: string;
  password?: string;
  password_confirmation?: string;
  education?: Array<{ institute_name: string; qualification: string; year: string }>;
  experience?: Array<{ hospital_name: string; no_of_years: string; year: string }>;
  social_media?: Array<{ title: string; link: string }>;
  membership?: Array<{ title: string; description: string; year: string }>;
  awards?: Array<{ title: string; description: string; year: string }>;
}

export interface UpdateDoctorPayload {
  doctor_name?: string;
  department?: string;
  specialist?: string;
  email_address?: string;
  mobile_number?: string;
  gender?: string;
  date_of_birth?: string;
  known_languages?: string | string[];
  registration_number?: string;
  about?: string;
  image?: File | string;
  present_address?: string;
  permanent_address?: string;
  display_name?: string;
  username?: string;
  password?: string;
  password_confirmation?: string;
  education?: Array<{ institute_name: string; qualification: string; year: string }>;
  experience?: Array<{ hospital_name: string; no_of_years: string; year: string }>;
  social_media?: Array<{ title: string; link: string }>;
  membership?: Array<{ title: string; description: string; year: string }>;
  awards?: Array<{ title: string; description: string; year: string }>;
}

export const doctorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query<DoctorsResponse, number | void>({
      query: (page = 1) => ({
        url: `/doctors?page=${page}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Doctor" as const, id })),
              { type: "Doctor", id: "LIST" },
            ]
          : [{ type: "Doctor", id: "LIST" }],
    }),
    getDoctorById: builder.query<SingleDoctorResponse, number>({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Doctor", id }],
    }),
    createDoctor: builder.mutation<SingleDoctorResponse, CreateDoctorPayload>({
      query: (data) => {
        const formData = new FormData();
        formData.append("doctor_name", data.doctor_name);
        formData.append("department", data.department);
        formData.append("specialist", data.specialist);
        formData.append("email_address", data.email_address);
        formData.append("mobile_number", data.mobile_number);
        if (data.gender) formData.append("gender", data.gender);
        if (data.date_of_birth) formData.append("date_of_birth", data.date_of_birth);
        // Always send known_languages as indexed array
        if (data.known_languages) {
          if (Array.isArray(data.known_languages)) {
            data.known_languages.forEach((lang, index) => {
              formData.append(`known_languages[${index}]`, String(lang));
            });
          } else if (typeof data.known_languages === 'string') {
            // If it's a string (comma-separated), split it and send as array
            const languages = data.known_languages.split(',').map(l => l.trim()).filter(l => l);
            languages.forEach((lang, index) => {
              formData.append(`known_languages[${index}]`, lang);
            });
          } else {
            formData.append("known_languages[0]", String(data.known_languages));
          }
        }
        if (data.registration_number) formData.append("registration_number", data.registration_number);
        if (data.about) formData.append("about", data.about);
        if (data.image) formData.append("image", data.image);
        if (data.present_address) formData.append("present_address", data.present_address);
        if (data.permanent_address) formData.append("permanent_address", data.permanent_address);
        if (data.display_name) formData.append("display_name", data.display_name);
        if (data.username) formData.append("username", data.username);
        if (data.password) formData.append("password", data.password);
        if (data.password_confirmation) formData.append("password_confirmation", data.password_confirmation);
        
        // Handle arrays
        if (data.education && data.education.length > 0) {
          data.education.forEach((edu, index) => {
            formData.append(`education[${index}][institute_name]`, edu.institute_name);
            formData.append(`education[${index}][qualification]`, edu.qualification);
            formData.append(`education[${index}][year]`, edu.year);
          });
        }
        
        if (data.experience && data.experience.length > 0) {
          data.experience.forEach((exp, index) => {
            formData.append(`experience[${index}][hospital_name]`, exp.hospital_name);
            formData.append(`experience[${index}][no_of_years]`, exp.no_of_years);
            formData.append(`experience[${index}][year]`, exp.year);
          });
        }
        
        if (data.social_media && data.social_media.length > 0) {
          data.social_media.forEach((sm, index) => {
            formData.append(`social_media[${index}][title]`, sm.title);
            formData.append(`social_media[${index}][link]`, sm.link);
          });
        }
        
        if (data.membership && data.membership.length > 0) {
          data.membership.forEach((mem, index) => {
            formData.append(`membership[${index}][title]`, mem.title);
            formData.append(`membership[${index}][description]`, mem.description);
            formData.append(`membership[${index}][year]`, mem.year);
          });
        }
        
        if (data.awards && data.awards.length > 0) {
          data.awards.forEach((award, index) => {
            formData.append(`awards[${index}][title]`, award.title);
            formData.append(`awards[${index}][description]`, award.description);
            formData.append(`awards[${index}][year]`, award.year);
          });
        }

        return {
          url: "/doctors",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Doctor", id: "LIST" }],
    }),
    updateDoctor: builder.mutation<
      SingleDoctorResponse,
      { id: number; data: UpdateDoctorPayload }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.doctor_name) formData.append("doctor_name", data.doctor_name);
        if (data.department) formData.append("department", data.department);
        if (data.specialist) formData.append("specialist", data.specialist);
        if (data.email_address) formData.append("email_address", data.email_address);
        if (data.mobile_number) formData.append("mobile_number", data.mobile_number);
        if (data.gender !== undefined) formData.append("gender", data.gender || "");
        if (data.date_of_birth) formData.append("date_of_birth", data.date_of_birth);
        // Always send known_languages as indexed array
        if (data.known_languages) {
          if (Array.isArray(data.known_languages)) {
            data.known_languages.forEach((lang, index) => {
              formData.append(`known_languages[${index}]`, String(lang));
            });
          } else if (typeof data.known_languages === 'string') {
            // If it's a string (comma-separated), split it and send as array
            const languages = data.known_languages.split(',').map(l => l.trim()).filter(l => l);
            languages.forEach((lang, index) => {
              formData.append(`known_languages[${index}]`, lang);
            });
          } else {
            formData.append("known_languages[0]", String(data.known_languages));
          }
        }
        if (data.registration_number) formData.append("registration_number", data.registration_number);
        if (data.about) formData.append("about", data.about);
        if (data.image) formData.append("image", data.image);
        if (data.present_address) formData.append("present_address", data.present_address);
        if (data.permanent_address) formData.append("permanent_address", data.permanent_address);
        if (data.display_name) formData.append("display_name", data.display_name);
        if (data.username) formData.append("username", data.username);
        if (data.password) formData.append("password", data.password);
        if (data.password_confirmation) formData.append("password_confirmation", data.password_confirmation);
        
        // Handle arrays
        if (data.education && data.education.length > 0) {
          data.education.forEach((edu, index) => {
            formData.append(`education[${index}][institute_name]`, edu.institute_name);
            formData.append(`education[${index}][qualification]`, edu.qualification);
            formData.append(`education[${index}][year]`, edu.year);
          });
        }
        
        if (data.experience && data.experience.length > 0) {
          data.experience.forEach((exp, index) => {
            formData.append(`experience[${index}][hospital_name]`, exp.hospital_name);
            formData.append(`experience[${index}][no_of_years]`, exp.no_of_years);
            formData.append(`experience[${index}][year]`, exp.year);
          });
        }
        
        if (data.social_media && data.social_media.length > 0) {
          data.social_media.forEach((sm, index) => {
            formData.append(`social_media[${index}][title]`, sm.title);
            formData.append(`social_media[${index}][link]`, sm.link);
          });
        }
        
        if (data.membership && data.membership.length > 0) {
          data.membership.forEach((mem, index) => {
            formData.append(`membership[${index}][title]`, mem.title);
            formData.append(`membership[${index}][description]`, mem.description);
            formData.append(`membership[${index}][year]`, mem.year);
          });
        }
        
        if (data.awards && data.awards.length > 0) {
          data.awards.forEach((award, index) => {
            formData.append(`awards[${index}][title]`, award.title);
            formData.append(`awards[${index}][description]`, award.description);
            formData.append(`awards[${index}][year]`, award.year);
          });
        }

        return {
          url: `/doctors/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Doctor", id: arg.id },
        { type: "Doctor", id: "LIST" },
      ],
    }),
    deleteDoctor: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Doctor", id },
        { type: "Doctor", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorApi;

