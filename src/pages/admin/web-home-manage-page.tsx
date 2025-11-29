"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Plus, Trash2, MoveUp, MoveDown, Save, Eye, X } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  overlayOpacity: number;
}

export default function WebHomeManagePage() {
  const [slides, setSlides] = useState<HeroSlide[]>([
    {
      id: "1",
      image: "/hero1.png",
      title: "Trusted Medical Care",
      subtitle: "Personalized Results",
      overlayOpacity: 40
    },
    {
      id: "2",
      image: "/hero2.png",
      title: "Trusted Medical Care",
      subtitle: "Personalized Results",
      overlayOpacity: 40
    },
    {
      id: "3",
      image: "/hero3.png",
      title: "Trusted Medical Care",
      subtitle: "Personalized Results",
      overlayOpacity: 40
    },
    {
      id: "4",
      image: "/hero4.png",
      title: "Trusted Medical Care",
      subtitle: "Personalized Results",
      overlayOpacity: 40
    }
  ]);

  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now().toString(),
      image: "/hero1.png",
      title: "New Slide Title",
      subtitle: "New Slide Subtitle",
      overlayOpacity: 40
    };
    setSlides([...slides, newSlide]);
  };

  const deleteSlide = (id: string) => {
    if (slides.length > 1) {
      setSlides(slides.filter(slide => slide.id !== id));
    }
  };

  const updateSlide = (id: string, updates: Partial<HeroSlide>) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, ...updates } : slide
    ));
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newSlides = [...slides];
      [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
      setSlides(newSlides);
    } else if (direction === 'down' && index < slides.length - 1) {
      const newSlides = [...slides];
      [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
      setSlides(newSlides);
    }
  };

  const handleSave = () => {
    // Here you would save to backend/API
    console.log("Saving slides:", slides);
    alert("Slides saved successfully!");
  };

  const nextPreview = () => {
    setCurrentPreviewIndex((prev) => (prev + 1) % slides.length);
  };

  const prevPreview = () => {
    setCurrentPreviewIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Home Page Hero Slider Management</h1>
        <p className="text-gray-600">Edit and manage your home page hero slider slides</p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button onClick={addSlide} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Slide
        </Button>
        <Button onClick={() => setShowPreview(true)} variant="outline" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Preview Slider
        </Button>
        <Button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Slides List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {slides.map((slide, index) => (
          <Card key={slide.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Slide {index + 1}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveSlide(index, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveSlide(index, 'down')}
                    disabled={index === slides.length - 1}
                    className="h-8 w-8"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSlide(slide.id)}
                    disabled={slides.length === 1}
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Preview Image */}
              <div className="mb-4">
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <img
                    src={slide.image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/vite.svg";
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-gray-950"
                    style={{ opacity: `${slide.overlayOpacity}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center text-white">
                      <h3 className="text-xl font-bold mb-2">{slide.title}</h3>
                      <p className="text-sm">{slide.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="space-y-4">
                <Field>
                  <FieldLabel>Background Image URL</FieldLabel>
                  <FieldContent>
                    <Input
                      value={slide.image}
                      onChange={(e) => updateSlide(slide.id, { image: e.target.value })}
                      placeholder="/hero1.png"
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Title</FieldLabel>
                  <FieldContent>
                    <Input
                      value={slide.title}
                      onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                      placeholder="Trusted Medical Care"
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Subtitle</FieldLabel>
                  <FieldContent>
                    <Input
                      value={slide.subtitle}
                      onChange={(e) => updateSlide(slide.id, { subtitle: e.target.value })}
                      placeholder="Personalized Results"
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Overlay Opacity: {slide.overlayOpacity}%</FieldLabel>
                  <FieldContent>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={slide.overlayOpacity}
                      onChange={(e) => updateSlide(slide.id, { overlayOpacity: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </FieldContent>
                </Field>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl h-[80vh] rounded-lg overflow-hidden bg-white">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white"
              onClick={() => setShowPreview(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Preview Slider */}
            <div className="relative w-full h-full overflow-hidden">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentPreviewIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0 bg-gray-950"
                    style={{ opacity: `${slide.overlayOpacity}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center text-white px-4">
                      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4">
                        {slide.title}
                      </h1>
                      <p className="text-xl sm:text-2xl md:text-3xl">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={prevPreview}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextPreview}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPreviewIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentPreviewIndex
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

