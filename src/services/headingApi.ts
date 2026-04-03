import { api } from "@/services/baseApi";

export interface Heading {
  id: number;
  homepage_hero_section_card_one_title?: string;
  homepage_hero_section_card_one_icon?: string;
  homepage_hero_section_card_two_title?: string;
  homepage_hero_section_card_two_icon?: string;
  homepage_hero_section_card_three_title?: string;
  homepage_hero_section_card_three_icon?: string;
  homepage_hero_section_card_four_title?: string;
  homepage_hero_section_card_four_icon?: string;
  homepage_hero_section_card_five_title?: string;
  homepage_hero_section_card_five_icon?: string;
  homepage_doctor_section_title?: string;
  homepage_news_and_media_section_title?: string;
  homepage_health_insight_section_title?: string;
  homepage_our_legacy_partner_section_title?: string;
  homepage_footer_quick_links_first_column_title?: string;
  homepage_footer_quick_links_second_column_title?: string;
  whatsapp_number?: string;
  hotline_number?: string;
  homepage_pricing_section_title?: string;
  homepage_pricing_section_button_text?: string;
  homepage_pricing_section_button_link?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HeadingResponse {
  success: boolean;
  message: string;
  data: Heading;
}

export interface UpdateHeadingPayload {
  homepage_hero_section_card_one_title?: string;
  homepage_hero_section_card_one_icon?: string;
  homepage_hero_section_card_two_title?: string;
  homepage_hero_section_card_two_icon?: string;
  homepage_hero_section_card_three_title?: string;
  homepage_hero_section_card_three_icon?: string;
  homepage_hero_section_card_four_title?: string;
  homepage_hero_section_card_four_icon?: string;
  homepage_hero_section_card_five_title?: string;
  homepage_hero_section_card_five_icon?: string;
  homepage_doctor_section_title?: string;
  homepage_news_and_media_section_title?: string;
  homepage_health_insight_section_title?: string;
  homepage_our_legacy_partner_section_title?: string;
  homepage_footer_quick_links_first_column_title?: string;
  homepage_footer_quick_links_second_column_title?: string;
  whatsapp_number?: string;
  hotline_number?: string;
  homepage_pricing_section_title?: string;
  homepage_pricing_section_button_text?: string;
  homepage_pricing_section_button_link?: string;
}

export const headingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHeadings: builder.query<HeadingResponse, void>({
      query: () => ({
        url: "/headings",
        method: "GET",
      }),
      providesTags: ["Heading"],
    }),
    updateHeading: builder.mutation<HeadingResponse, UpdateHeadingPayload>({
      query: (body) => ({
        url: "/headings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Heading"],
    }),
  }),
});

export const { useGetHeadingsQuery, useUpdateHeadingMutation } = headingApi;
