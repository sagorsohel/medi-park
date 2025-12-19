import { api } from "@/services/baseApi";

export interface Investor {
  id: number;
  investor_identity_number: string;
  file_number?: string;
  applicant_full_name?: string;
  fathers_name?: string;
  mothers_name?: string;
  spouses_name?: string;
  investor_name: string;
  email_address: string;
  mobile_number: string;
  gender: string | null;
  date_of_birth: string | null;
  nationality?: string;
  religion?: string;
  residency_status?: string;
  marital_status?: string;
  marriage_date?: string;
  organization?: string;
  profession?: string;
  nid_pp_bc_number?: string;
  tin_number?: string;
  about: string | null;
  image: string | null;
  applicant_image?: string | null;
  present_address: string | null;
  permanent_address: string | null;
  // Nominee Information
  nominee_name?: string;
  nominee_relation?: string;
  nominee_mobile_number?: string;
  nominee_nid_pp_bc_number?: string;
  nominee_present_address?: string;
  nominee_permanent_address?: string;
  nominee_image?: string | null;
  // Project Information
  project_present_address?: string;
  project_permanent_address?: string;
  // Share Information
  category_of_share?: string;
  price_per_hss?: string;
  number_of_hss?: string;
  total_price?: string;
  total_price_in_words?: string;
  special_discount?: string;
  // Payment Information
  mode_of_payment?: string;
  others_instructions?: string;
  agreed_price?: string;
  installment_start_from?: string;
  installment_start_to?: string;
  booking_money?: string;
  booking_money_in_words?: string;
  booking_money_date?: string;
  booking_money_cash_cheque_no?: string;
  booking_money_branch?: string;
  booking_money_on_or_before?: string;
  booking_money_mobile_number?: string;
  payment_in_words?: string;
  final_payment_date?: string;
  bank_name?: string;
  down_payment?: string;
  down_payment_date?: string;
  instructions_if_any?: string;
  reference_name_a?: string;
  reference_name_b?: string;
  rest_amount?: string;
  rest_amount_in_words?: string;
  created_at: string;
  updated_at: string;
}

export interface InvestorPagination {
  per_page: number;
  total_count: number;
  total_page: number;
  current_page: number;
  current_page_count: number;
  next_page: number | null;
  previous_page: number | null;
}

export interface InvestorsResponse {
  success: boolean;
  message: string;
  pagination: InvestorPagination;
  data: Investor[];
}

export interface SingleInvestorResponse {
  success: boolean;
  message: string;
  data: Investor;
}

export interface CreateInvestorPayload {
  file_number?: string;
  applicant_full_name?: string;
  fathers_name?: string;
  mothers_name?: string;
  spouses_name?: string;
  investor_name: string;
  email_address: string;
  mobile_number: string;
  gender?: string;
  date_of_birth?: string;
  nationality?: string;
  religion?: string;
  residency_status?: string;
  marital_status?: string;
  marriage_date?: string;
  organization?: string;
  profession?: string;
  nid_pp_bc_number?: string;
  tin_number?: string;
  about?: string;
  image?: File | string;
  applicant_image?: File | string;
  present_address?: string;
  permanent_address?: string;
  // Nominee Information
  nominee_name?: string;
  nominee_relation?: string;
  nominee_mobile_number?: string;
  nominee_nid_pp_bc_number?: string;
  nominee_present_address?: string;
  nominee_permanent_address?: string;
  nominee_image?: File | string;
  // Project Information
  project_present_address?: string;
  project_permanent_address?: string;
  // Share Information
  category_of_share?: string;
  price_per_hss?: string;
  number_of_hss?: string;
  total_price?: string;
  total_price_in_words?: string;
  special_discount?: string;
  // Payment Information
  mode_of_payment?: string;
  others_instructions?: string;
  agreed_price?: string;
  installment_start_from?: string;
  installment_start_to?: string;
  booking_money?: string;
  booking_money_in_words?: string;
  booking_money_date?: string;
  booking_money_cash_cheque_no?: string;
  booking_money_branch?: string;
  booking_money_on_or_before?: string;
  booking_money_mobile_number?: string;
  payment_in_words?: string;
  final_payment_date?: string;
  bank_name?: string;
  down_payment?: string;
  down_payment_date?: string;
  instructions_if_any?: string;
  reference_name_a?: string;
  reference_name_b?: string;
  rest_amount?: string;
  rest_amount_in_words?: string;
}

export interface UpdateInvestorPayload {
  file_number?: string;
  applicant_full_name?: string;
  fathers_name?: string;
  mothers_name?: string;
  spouses_name?: string;
  investor_name?: string;
  email_address?: string;
  mobile_number?: string;
  gender?: string;
  date_of_birth?: string;
  nationality?: string;
  religion?: string;
  residency_status?: string;
  marital_status?: string;
  marriage_date?: string;
  organization?: string;
  profession?: string;
  nid_pp_bc_number?: string;
  tin_number?: string;
  about?: string;
  image?: File | string;
  applicant_image?: File | string;
  present_address?: string;
  permanent_address?: string;
  // Nominee Information
  nominee_name?: string;
  nominee_relation?: string;
  nominee_mobile_number?: string;
  nominee_nid_pp_bc_number?: string;
  nominee_present_address?: string;
  nominee_permanent_address?: string;
  nominee_image?: File | string;
  // Project Information
  project_present_address?: string;
  project_permanent_address?: string;
  // Share Information
  category_of_share?: string;
  price_per_hss?: string;
  number_of_hss?: string;
  total_price?: string;
  total_price_in_words?: string;
  special_discount?: string;
  // Payment Information
  mode_of_payment?: string;
  others_instructions?: string;
  agreed_price?: string;
  installment_start_from?: string;
  installment_start_to?: string;
  booking_money?: string;
  booking_money_in_words?: string;
  booking_money_date?: string;
  booking_money_cash_cheque_no?: string;
  booking_money_branch?: string;
  booking_money_on_or_before?: string;
  booking_money_mobile_number?: string;
  payment_in_words?: string;
  final_payment_date?: string;
  bank_name?: string;
  down_payment?: string;
  down_payment_date?: string;
  instructions_if_any?: string;
  reference_name_a?: string;
  reference_name_b?: string;
  rest_amount?: string;
  rest_amount_in_words?: string;
}

export const investorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInvestors: builder.query<InvestorsResponse, number | void>({
      query: (page = 1) => ({
        url: `/investors?page=${page}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Investor" as const, id })),
              { type: "Investor", id: "LIST" },
            ]
          : [{ type: "Investor", id: "LIST" }],
    }),
    getInvestorById: builder.query<SingleInvestorResponse, number>({
      query: (id) => ({
        url: `/investors/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Investor", id }],
    }),
    createInvestor: builder.mutation<SingleInvestorResponse, CreateInvestorPayload>({
      query: (data) => {
        const formData = new FormData();
        if (data.file_number) formData.append("file_number", data.file_number);
        if (data.applicant_full_name) formData.append("applicant_full_name", data.applicant_full_name);
        if (data.fathers_name) formData.append("fathers_name", data.fathers_name);
        if (data.mothers_name) formData.append("mothers_name", data.mothers_name);
        if (data.spouses_name) formData.append("spouses_name", data.spouses_name);
        formData.append("investor_name", data.investor_name);
        formData.append("email_address", data.email_address);
        formData.append("mobile_number", data.mobile_number);
        if (data.gender) formData.append("gender", data.gender);
        if (data.date_of_birth) formData.append("date_of_birth", data.date_of_birth);
        if (data.nationality) formData.append("nationality", data.nationality);
        if (data.religion) formData.append("religion", data.religion);
        if (data.residency_status) formData.append("residency_status", data.residency_status);
        if (data.marital_status) formData.append("marital_status", data.marital_status);
        if (data.marriage_date) formData.append("marriage_date", data.marriage_date);
        if (data.organization) formData.append("organization", data.organization);
        if (data.profession) formData.append("profession", data.profession);
        if (data.nid_pp_bc_number) formData.append("nid_pp_bc_number", data.nid_pp_bc_number);
        if (data.tin_number) formData.append("tin_number", data.tin_number);
        if (data.about) formData.append("about", data.about);
        if (data.image) formData.append("image", data.image);
        if (data.applicant_image) formData.append("applicant_image", data.applicant_image);
        if (data.present_address) formData.append("present_address", data.present_address);
        if (data.permanent_address) formData.append("permanent_address", data.permanent_address);
        // Nominee Information
        if (data.nominee_name) formData.append("nominee_name", data.nominee_name);
        if (data.nominee_relation) formData.append("nominee_relation", data.nominee_relation);
        if (data.nominee_mobile_number) formData.append("nominee_mobile_number", data.nominee_mobile_number);
        if (data.nominee_nid_pp_bc_number) formData.append("nominee_nid_pp_bc_number", data.nominee_nid_pp_bc_number);
        if (data.nominee_present_address) formData.append("nominee_present_address", data.nominee_present_address);
        if (data.nominee_permanent_address) formData.append("nominee_permanent_address", data.nominee_permanent_address);
        if (data.nominee_image) formData.append("nominee_image", data.nominee_image);
        // Project Information
        if (data.project_present_address) formData.append("project_present_address", data.project_present_address);
        if (data.project_permanent_address) formData.append("project_permanent_address", data.project_permanent_address);
        // Share Information
        if (data.category_of_share) formData.append("category_of_share", data.category_of_share);
        if (data.price_per_hss) formData.append("price_per_hss", data.price_per_hss);
        if (data.number_of_hss) formData.append("number_of_hss", data.number_of_hss);
        if (data.total_price) formData.append("total_price", data.total_price);
        if (data.total_price_in_words) formData.append("total_price_in_words", data.total_price_in_words);
        if (data.special_discount) formData.append("special_discount", data.special_discount);
        // Payment Information
        if (data.mode_of_payment) formData.append("mode_of_payment", data.mode_of_payment);
        if (data.others_instructions) formData.append("others_instructions", data.others_instructions);
        if (data.agreed_price) formData.append("agreed_price", data.agreed_price);
        if (data.installment_start_from) formData.append("installment_start_from", data.installment_start_from);
        if (data.installment_start_to) formData.append("installment_start_to", data.installment_start_to);
        if (data.booking_money) formData.append("booking_money", data.booking_money);
        if (data.booking_money_in_words) formData.append("booking_money_in_words", data.booking_money_in_words);
        if (data.booking_money_date) formData.append("booking_money_date", data.booking_money_date);
        if (data.booking_money_cash_cheque_no) formData.append("booking_money_cash_cheque_no", data.booking_money_cash_cheque_no);
        if (data.booking_money_branch) formData.append("booking_money_branch", data.booking_money_branch);
        if (data.booking_money_on_or_before) formData.append("booking_money_on_or_before", data.booking_money_on_or_before);
        if (data.booking_money_mobile_number) formData.append("booking_money_mobile_number", data.booking_money_mobile_number);
        if (data.payment_in_words) formData.append("payment_in_words", data.payment_in_words);
        if (data.final_payment_date) formData.append("final_payment_date", data.final_payment_date);
        if (data.bank_name) formData.append("bank_name", data.bank_name);
        if (data.down_payment) formData.append("down_payment", data.down_payment);
        if (data.down_payment_date) formData.append("down_payment_date", data.down_payment_date);
        if (data.instructions_if_any) formData.append("instructions_if_any", data.instructions_if_any);
        if (data.reference_name_a) formData.append("reference_name_a", data.reference_name_a);
        if (data.reference_name_b) formData.append("reference_name_b", data.reference_name_b);
        if (data.rest_amount) formData.append("rest_amount", data.rest_amount);
        if (data.rest_amount_in_words) formData.append("rest_amount_in_words", data.rest_amount_in_words);

        return {
          url: "/investors",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Investor", id: "LIST" }],
    }),
    updateInvestor: builder.mutation<
      SingleInvestorResponse,
      { id: number; data: UpdateInvestorPayload }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();
        if (data.file_number !== undefined) formData.append("file_number", data.file_number || "");
        if (data.applicant_full_name !== undefined) formData.append("applicant_full_name", data.applicant_full_name || "");
        if (data.fathers_name !== undefined) formData.append("fathers_name", data.fathers_name || "");
        if (data.mothers_name !== undefined) formData.append("mothers_name", data.mothers_name || "");
        if (data.spouses_name !== undefined) formData.append("spouses_name", data.spouses_name || "");
        if (data.investor_name) formData.append("investor_name", data.investor_name);
        if (data.email_address) formData.append("email_address", data.email_address);
        if (data.mobile_number) formData.append("mobile_number", data.mobile_number);
        if (data.gender !== undefined) formData.append("gender", data.gender || "");
        if (data.date_of_birth) formData.append("date_of_birth", data.date_of_birth);
        if (data.nationality !== undefined) formData.append("nationality", data.nationality || "");
        if (data.religion !== undefined) formData.append("religion", data.religion || "");
        if (data.residency_status !== undefined) formData.append("residency_status", data.residency_status || "");
        if (data.marital_status !== undefined) formData.append("marital_status", data.marital_status || "");
        if (data.marriage_date) formData.append("marriage_date", data.marriage_date);
        if (data.organization !== undefined) formData.append("organization", data.organization || "");
        if (data.profession !== undefined) formData.append("profession", data.profession || "");
        if (data.nid_pp_bc_number !== undefined) formData.append("nid_pp_bc_number", data.nid_pp_bc_number || "");
        if (data.tin_number !== undefined) formData.append("tin_number", data.tin_number || "");
        if (data.about) formData.append("about", data.about);
        if (data.image) formData.append("image", data.image);
        if (data.applicant_image) formData.append("applicant_image", data.applicant_image);
        if (data.present_address) formData.append("present_address", data.present_address);
        if (data.permanent_address) formData.append("permanent_address", data.permanent_address);
        // Nominee Information
        if (data.nominee_name !== undefined) formData.append("nominee_name", data.nominee_name || "");
        if (data.nominee_relation !== undefined) formData.append("nominee_relation", data.nominee_relation || "");
        if (data.nominee_mobile_number !== undefined) formData.append("nominee_mobile_number", data.nominee_mobile_number || "");
        if (data.nominee_nid_pp_bc_number !== undefined) formData.append("nominee_nid_pp_bc_number", data.nominee_nid_pp_bc_number || "");
        if (data.nominee_present_address !== undefined) formData.append("nominee_present_address", data.nominee_present_address || "");
        if (data.nominee_permanent_address !== undefined) formData.append("nominee_permanent_address", data.nominee_permanent_address || "");
        if (data.nominee_image) formData.append("nominee_image", data.nominee_image);
        // Project Information
        if (data.project_present_address !== undefined) formData.append("project_present_address", data.project_present_address || "");
        if (data.project_permanent_address !== undefined) formData.append("project_permanent_address", data.project_permanent_address || "");
        // Share Information
        if (data.category_of_share !== undefined) formData.append("category_of_share", data.category_of_share || "");
        if (data.price_per_hss !== undefined) formData.append("price_per_hss", data.price_per_hss || "");
        if (data.number_of_hss !== undefined) formData.append("number_of_hss", data.number_of_hss || "");
        if (data.total_price !== undefined) formData.append("total_price", data.total_price || "");
        if (data.total_price_in_words !== undefined) formData.append("total_price_in_words", data.total_price_in_words || "");
        if (data.special_discount !== undefined) formData.append("special_discount", data.special_discount || "");
        // Payment Information
        if (data.mode_of_payment !== undefined) formData.append("mode_of_payment", data.mode_of_payment || "");
        if (data.others_instructions !== undefined) formData.append("others_instructions", data.others_instructions || "");
        if (data.agreed_price !== undefined) formData.append("agreed_price", data.agreed_price || "");
        if (data.installment_start_from) formData.append("installment_start_from", data.installment_start_from);
        if (data.installment_start_to) formData.append("installment_start_to", data.installment_start_to);
        if (data.booking_money !== undefined) formData.append("booking_money", data.booking_money || "");
        if (data.booking_money_in_words !== undefined) formData.append("booking_money_in_words", data.booking_money_in_words || "");
        if (data.booking_money_date) formData.append("booking_money_date", data.booking_money_date);
        if (data.booking_money_cash_cheque_no !== undefined) formData.append("booking_money_cash_cheque_no", data.booking_money_cash_cheque_no || "");
        if (data.booking_money_branch !== undefined) formData.append("booking_money_branch", data.booking_money_branch || "");
        if (data.booking_money_on_or_before) formData.append("booking_money_on_or_before", data.booking_money_on_or_before);
        if (data.booking_money_mobile_number !== undefined) formData.append("booking_money_mobile_number", data.booking_money_mobile_number || "");
        if (data.payment_in_words !== undefined) formData.append("payment_in_words", data.payment_in_words || "");
        if (data.final_payment_date) formData.append("final_payment_date", data.final_payment_date);
        if (data.bank_name !== undefined) formData.append("bank_name", data.bank_name || "");
        if (data.down_payment !== undefined) formData.append("down_payment", data.down_payment || "");
        if (data.down_payment_date) formData.append("down_payment_date", data.down_payment_date);
        if (data.instructions_if_any !== undefined) formData.append("instructions_if_any", data.instructions_if_any || "");
        if (data.reference_name_a !== undefined) formData.append("reference_name_a", data.reference_name_a || "");
        if (data.reference_name_b !== undefined) formData.append("reference_name_b", data.reference_name_b || "");
        if (data.rest_amount !== undefined) formData.append("rest_amount", data.rest_amount || "");
        if (data.rest_amount_in_words !== undefined) formData.append("rest_amount_in_words", data.rest_amount_in_words || "");

        return {
          url: `/investors/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Investor", id: arg.id },
        { type: "Investor", id: "LIST" },
      ],
    }),
    deleteInvestor: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/investors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Investor", id },
        { type: "Investor", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetInvestorsQuery,
  useGetInvestorByIdQuery,
  useCreateInvestorMutation,
  useUpdateInvestorMutation,
  useDeleteInvestorMutation,
} = investorApi;

