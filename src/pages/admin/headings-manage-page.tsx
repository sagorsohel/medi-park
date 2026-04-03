"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Loader2, Save, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetHeadingsQuery, useUpdateHeadingMutation, type UpdateHeadingPayload } from "@/services/headingApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { IconSelector } from "@/components/admin/icon-selector";

export default function HeadingsManagePage() {
  const navigate = useNavigate();
  const { data: headingData, isLoading: isFetching } = useGetHeadingsQuery();
  const [updateHeading, { isLoading: isUpdating }] = useUpdateHeadingMutation();

  const [formData, setFormData] = useState<UpdateHeadingPayload>({
    homepage_hero_section_card_one_title: "",
    homepage_hero_section_card_one_icon: "",
    homepage_hero_section_card_two_title: "",
    homepage_hero_section_card_two_icon: "",
    homepage_hero_section_card_three_title: "",
    homepage_hero_section_card_three_icon: "",
    homepage_hero_section_card_four_title: "",
    homepage_hero_section_card_four_icon: "",
    homepage_hero_section_card_five_title: "",
    homepage_hero_section_card_five_icon: "",
    homepage_doctor_section_title: "",
    homepage_news_and_media_section_title: "",
    homepage_health_insight_section_title: "",
    homepage_our_legacy_partner_section_title: "",
    homepage_footer_quick_links_first_column_title: "",
    homepage_footer_quick_links_second_column_title: "",
    whatsapp_number: "",
    hotline_number: "",
    homepage_pricing_section_title: "",
    homepage_pricing_section_button_text: "",
    homepage_pricing_section_button_link: "",
  });

  useEffect(() => {
    if (headingData?.data) {
      const data = headingData.data;
      setFormData({
        homepage_hero_section_card_one_title: data.homepage_hero_section_card_one_title || "",
        homepage_hero_section_card_one_icon: data.homepage_hero_section_card_one_icon || "",
        homepage_hero_section_card_two_title: data.homepage_hero_section_card_two_title || "",
        homepage_hero_section_card_two_icon: data.homepage_hero_section_card_two_icon || "",
        homepage_hero_section_card_three_title: data.homepage_hero_section_card_three_title || "",
        homepage_hero_section_card_three_icon: data.homepage_hero_section_card_three_icon || "",
        homepage_hero_section_card_four_title: data.homepage_hero_section_card_four_title || "",
        homepage_hero_section_card_four_icon: data.homepage_hero_section_card_four_icon || "",
        homepage_hero_section_card_five_title: data.homepage_hero_section_card_five_title || "",
        homepage_hero_section_card_five_icon: data.homepage_hero_section_card_five_icon || "",
        homepage_doctor_section_title: data.homepage_doctor_section_title || "",
        homepage_news_and_media_section_title: data.homepage_news_and_media_section_title || "",
        homepage_health_insight_section_title: data.homepage_health_insight_section_title || "",
        homepage_our_legacy_partner_section_title: data.homepage_our_legacy_partner_section_title || "",
        homepage_footer_quick_links_first_column_title: data.homepage_footer_quick_links_first_column_title || "",
        homepage_footer_quick_links_second_column_title: data.homepage_footer_quick_links_second_column_title || "",
        whatsapp_number: data.whatsapp_number || "",
        hotline_number: data.hotline_number || "",
        homepage_pricing_section_title: data.homepage_pricing_section_title || "",
        homepage_pricing_section_button_text: data.homepage_pricing_section_button_text || "",
        homepage_pricing_section_button_link: data.homepage_pricing_section_button_link || "",
      });
    }
  }, [headingData]);

  const handleInputChange = (field: keyof UpdateHeadingPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateHeading(formData).unwrap();
      toast.success("Headings updated successfully!");
    } catch (error: any) {
      console.error("Failed to update headings:", error);
      toast.error(error?.data?.message || "Failed to update headings");
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Website Headings & Contact</h1>
            <p className="text-gray-600">Manage website section titles, hero cards, and contact numbers</p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Numbers */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b pb-4">
            <CardTitle className="text-xl text-gray-800">Contact Numbers</CardTitle>
            <CardDescription>Update global contact information for the website.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>WhatsApp Number</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.whatsapp_number}
                    onChange={(e) => handleInputChange("whatsapp_number", e.target.value)}
                    placeholder="e.g. +8801234567890"
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Hotline Number</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.hotline_number}
                    onChange={(e) => handleInputChange("hotline_number", e.target.value)}
                    placeholder="e.g. 10666"
                  />
                </FieldContent>
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section Cards */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b pb-4">
            <CardTitle className="text-xl text-gray-800">Hero Section Quick Access Cards</CardTitle>
            <CardDescription>Manage titles and icons for the five floating cards in the homepage hero section.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {[1, 2, 3, 4, 5].map((num) => {
              const num_text = num === 1 ? 'one' : num === 2 ? 'two' : num === 3 ? 'three' : num === 4 ? 'four' : 'five';
              return (
                <div key={num} className="p-4 rounded-lg bg-gray-50/30 border border-gray-100">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">{num}</span>
                    Card {num === 1 ? 'One' : num === 2 ? 'Two' : num === 3 ? 'Three' : num === 4 ? 'Four' : 'Five'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field>
                      <FieldLabel>Card Title</FieldLabel>
                      <FieldContent>
                        <Input
                          value={formData[`homepage_hero_section_card_${num_text}_title` as keyof UpdateHeadingPayload]}
                          onChange={(e) => handleInputChange(`homepage_hero_section_card_${num_text}_title` as keyof UpdateHeadingPayload, e.target.value)}
                          placeholder="Enter card title"
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel>Card Icon</FieldLabel>
                      <FieldContent>
                        <IconSelector
                          value={formData[`homepage_hero_section_card_${num_text}_icon` as keyof UpdateHeadingPayload] || ""}
                          onChange={(val) => handleInputChange(`homepage_hero_section_card_${num_text}_icon` as keyof UpdateHeadingPayload, val)}
                        />
                      </FieldContent>
                    </Field>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Section Titles */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b pb-4">
            <CardTitle className="text-xl text-gray-800">Website Section Titles</CardTitle>
            <CardDescription>Manage the main headings for various section modules on the homepage.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Field>
                <FieldLabel>Doctor Section Title</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.homepage_doctor_section_title}
                    onChange={(e) => handleInputChange("homepage_doctor_section_title", e.target.value)}
                    placeholder="Enter section title"
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Legacy Partner Section Title</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.homepage_our_legacy_partner_section_title}
                    onChange={(e) => handleInputChange("homepage_our_legacy_partner_section_title", e.target.value)}
                    placeholder="Enter section title"
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>News & Media Section Title</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.homepage_news_and_media_section_title}
                    onChange={(e) => handleInputChange("homepage_news_and_media_section_title", e.target.value)}
                    placeholder="Enter section title"
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Footer Quick Links Column 1 Title</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.homepage_footer_quick_links_first_column_title}
                    onChange={(e) => handleInputChange("homepage_footer_quick_links_first_column_title", e.target.value)}
                    placeholder="Enter column title"
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Health Insight Section Title</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.homepage_health_insight_section_title}
                    onChange={(e) => handleInputChange("homepage_health_insight_section_title", e.target.value)}
                    placeholder="Enter section title"
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Footer Quick Links Column 2 Title</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.homepage_footer_quick_links_second_column_title}
                    onChange={(e) => handleInputChange("homepage_footer_quick_links_second_column_title", e.target.value)}
                    placeholder="Enter column title"
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Pricing Section Title</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.homepage_pricing_section_title}
                    onChange={(e) => handleInputChange("homepage_pricing_section_title", e.target.value)}
                    placeholder="Enter pricing section title"
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Pricing Section Button Text</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.homepage_pricing_section_button_text}
                    onChange={(e) => handleInputChange("homepage_pricing_section_button_text", e.target.value)}
                    placeholder="Explore All Packages"
                  />
                </FieldContent>
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel>Pricing Section Button Link</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.homepage_pricing_section_button_link}
                    onChange={(e) => handleInputChange("homepage_pricing_section_button_link", e.target.value)}
                    placeholder="e.g. /packages"
                  />
                </FieldContent>
              </Field>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isUpdating}
            className="min-w-[180px] h-12 text-lg shadow-md hover:shadow-lg transition-all"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
