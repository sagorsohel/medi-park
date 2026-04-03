"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, ChevronLeft } from "lucide-react";
import { useGetHeadingsQuery, useUpdateHeadingMutation, type UpdateHeadingPayload } from "@/services/headingApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-8 w-8 -ml-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Website Headings & Contact</h1>
          </div>
          <p className="text-gray-600 ml-8">Manage website section titles, hero cards, and contact numbers</p>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isUpdating}
          className="flex items-center gap-2"
        >
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Numbers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Contact Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <Input
                id="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={(e) => handleInputChange("whatsapp_number", e.target.value)}
                placeholder="e.g. +8801234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hotline_number">Hotline Number</Label>
              <Input
                id="hotline_number"
                value={formData.hotline_number}
                onChange={(e) => handleInputChange("hotline_number", e.target.value)}
                placeholder="e.g. 10666"
              />
            </div>
          </div>
        </div>

        {/* Hero Section Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Hero Section Quick Access Cards</h2>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-gray-50/50 border border-gray-100">
                <div className="space-y-2">
                  <Label htmlFor={`card_${num}_title`}>Card {num} Title</Label>
                  <Input
                    id={`card_${num}_title`}
                    value={formData[`homepage_hero_section_card_${num === 1 ? 'one' : num === 2 ? 'two' : num === 3 ? 'three' : num === 4 ? 'four' : 'five'}_title` as keyof UpdateHeadingPayload]}
                    onChange={(e) => handleInputChange(`homepage_hero_section_card_${num === 1 ? 'one' : num === 2 ? 'two' : num === 3 ? 'three' : num === 4 ? 'four' : 'five'}_title` as keyof UpdateHeadingPayload, e.target.value)}
                    placeholder={`Enter card ${num} title`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`card_${num}_icon`}>Card {num} Icon (Lucide name or URL)</Label>
                  <Input
                    id={`card_${num}_icon`}
                    value={formData[`homepage_hero_section_card_${num === 1 ? 'one' : num === 2 ? 'two' : num === 3 ? 'three' : num === 4 ? 'four' : 'five'}_icon` as keyof UpdateHeadingPayload]}
                    onChange={(e) => handleInputChange(`homepage_hero_section_card_${num === 1 ? 'one' : num === 2 ? 'two' : num === 3 ? 'three' : num === 4 ? 'four' : 'five'}_icon` as keyof UpdateHeadingPayload, e.target.value)}
                    placeholder={`Enter card ${num} icon`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Titles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Website Section Titles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="homepage_doctor_section_title">Doctor Section Title</Label>
                <Input
                  id="homepage_doctor_section_title"
                  value={formData.homepage_doctor_section_title}
                  onChange={(e) => handleInputChange("homepage_doctor_section_title", e.target.value)}
                  placeholder="Enter title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homepage_news_and_media_section_title">News & Media Section Title</Label>
                <Input
                  id="homepage_news_and_media_section_title"
                  value={formData.homepage_news_and_media_section_title}
                  onChange={(e) => handleInputChange("homepage_news_and_media_section_title", e.target.value)}
                  placeholder="Enter title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homepage_health_insight_section_title">Health Insight Section Title</Label>
                <Input
                  id="homepage_health_insight_section_title"
                  value={formData.homepage_health_insight_section_title}
                  onChange={(e) => handleInputChange("homepage_health_insight_section_title", e.target.value)}
                  placeholder="Enter title"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="homepage_our_legacy_partner_section_title">Legacy Partner Section Title</Label>
                <Input
                  id="homepage_our_legacy_partner_section_title"
                  value={formData.homepage_our_legacy_partner_section_title}
                  onChange={(e) => handleInputChange("homepage_our_legacy_partner_section_title", e.target.value)}
                  placeholder="Enter title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homepage_footer_quick_links_first_column_title">Footer Quick Links Column 1 Title</Label>
                <Input
                  id="homepage_footer_quick_links_first_column_title"
                  value={formData.homepage_footer_quick_links_first_column_title}
                  onChange={(e) => handleInputChange("homepage_footer_quick_links_first_column_title", e.target.value)}
                  placeholder="Enter title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homepage_footer_quick_links_second_column_title">Footer Quick Links Column 2 Title</Label>
                <Input
                  id="homepage_footer_quick_links_second_column_title"
                  value={formData.homepage_footer_quick_links_second_column_title}
                  onChange={(e) => handleInputChange("homepage_footer_quick_links_second_column_title", e.target.value)}
                  placeholder="Enter title"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={isUpdating}
            className="min-w-[150px] h-11"
          >
            {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
