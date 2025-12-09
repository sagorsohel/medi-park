"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Plus, Trash2, MoveUp, MoveDown, Eye, X, Loader2, RefreshCw, Check, XCircle } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useGetHeroSectionsQuery,
  useCreateHeroSectionMutation,
  useUpdateHeroSectionMutation,
  useDeleteHeroSectionMutation,
  useSetHeroSectionActiveMutation,
} from "@/services/homepageApi";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  overlayOpacity: number;
  serial: string;
  status: 'active' | 'inactive';
}

interface DraftSlide {
  id: string; // temporary ID like 'draft-123'
  image: string;
  title: string;
  subtitle: string;
  overlayOpacity: number;
  serial: string;
  status: 'active' | 'inactive';
  imageFile?: File;
}

export function HeroSectionManage() {
  const { data, isLoading, error, refetch } = useGetHeroSectionsQuery();
  const [createHeroSection] = useCreateHeroSectionMutation();
  const [updateHeroSection] = useUpdateHeroSectionMutation();
  const [deleteHeroSection] = useDeleteHeroSectionMutation();
  const [setHeroSectionActive] = useSetHeroSectionActiveMutation();

  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<number | null>(null);
  const [newSlideId, setNewSlideId] = useState<number | null>(null);
  const slideRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Local state for editable slides (pending changes)
  const [editableSlides, setEditableSlides] = useState<{ [key: number]: Partial<HeroSlide> & { imageFile?: File; originalImage?: string } }>({});
  const [updatingSlides, setUpdatingSlides] = useState<{ [key: number]: boolean }>({});

  // Draft slides (new slides not yet created)
  const [draftSlides, setDraftSlides] = useState<DraftSlide[]>([]);
  const [creatingSlides, setCreatingSlides] = useState<{ [key: string]: boolean }>({});

  // Map API data to component format
  const slides = useMemo<HeroSlide[]>(() => {
    if (!data?.data) return [];
    return [...data.data]
      .sort((a, b) => parseInt(a.serial) - parseInt(b.serial))
      .map((section) => ({
        id: section.id,
        image: section.background_image,
        title: section.title,
        subtitle: section.subtitle,
        overlayOpacity: Math.round(parseFloat(section.opacity) * 100),
        serial: section.serial,
        status: section.status,
      }));
  }, [data]);

  // Scroll to newly created slide
  useEffect(() => {
    if (newSlideId && slideRefs.current[newSlideId]) {
      slideRefs.current[newSlideId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      setNewSlideId(null);
    }
  }, [newSlideId, slides]);

  // Reset editable slides when slides data changes
  useEffect(() => {
    if (data?.data) {
      setEditableSlides({});
    }
  }, [data]);

  const addSlide = () => {
    const newSerial = slides.length + draftSlides.length > 0
      ? (Math.max(
        ...slides.map(s => parseInt(s.serial)),
        ...draftSlides.map(s => parseInt(s.serial))
      ) + 1).toString()
      : "1";

    const draftId = `draft-${Date.now()}`;
    const newDraft: DraftSlide = {
      id: draftId,
      image: "",
      title: "",
      subtitle: "",
      overlayOpacity: 50,
      serial: newSerial,
      status: "inactive",
    };

    setDraftSlides(prev => [...prev, newDraft]);

    // Scroll to the new draft after a brief delay
    setTimeout(() => {
      const element = document.getElementById(`slide-${draftId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleDeleteClick = (id: number) => {
    if (slides.length <= 1) {
      alert("Cannot delete the last slide. You must have at least one slide.");
      return;
    }
    setSlideToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (slideToDelete === null) return;

    try {
      await deleteHeroSection(slideToDelete).unwrap();
      refetch();
      setSlideToDelete(null);
    } catch (error) {
      console.error("Failed to delete slide:", error);
      alert("Failed to delete slide. Please try again.");
    }
  };

  const getSlideValue = <T extends keyof HeroSlide>(slide: HeroSlide, field: T): HeroSlide[T] => {
    if (editableSlides[slide.id] && field in editableSlides[slide.id]) {
      const editableValue = editableSlides[slide.id][field];
      if (editableValue !== undefined) {
        return editableValue as HeroSlide[T];
      }
    }
    return slide[field];
  };

  const hasChanges = (slide: HeroSlide): boolean => {
    const editable = editableSlides[slide.id];
    if (!editable || Object.keys(editable).length === 0) return false;

    if (editable.title !== undefined && editable.title !== slide.title) return true;
    if (editable.subtitle !== undefined && editable.subtitle !== slide.subtitle) return true;
    if (editable.overlayOpacity !== undefined && editable.overlayOpacity !== slide.overlayOpacity) return true;
    if (editable.status !== undefined && editable.status !== slide.status) return true;
    if (editable.imageFile !== undefined) return true;

    return false;
  };

  const handleFieldChange = <T extends keyof HeroSlide>(id: number, field: T, value: HeroSlide[T]) => {
    setEditableSlides(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      }
    }));
  };

  const handleImageChange = (id: number, file: File | null) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setEditableSlides(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        imageFile: file,
        image: previewUrl,
      }
    }));
  };

  const handleUpdateSlide = async (slide: HeroSlide) => {
    const editable = editableSlides[slide.id];
    if (!editable || !hasChanges(slide)) return;

    setUpdatingSlides(prev => ({ ...prev, [slide.id]: true }));

    try {
      const updateData: {
        title?: string;
        subtitle?: string;
        background_image?: string | File;
        opacity?: string;
        serial?: string;
        status?: 'active' | 'inactive';
      } = {};

      if (editable.title !== undefined) updateData.title = editable.title;
      if (editable.subtitle !== undefined) updateData.subtitle = editable.subtitle;
      if (editable.imageFile !== undefined) {
        updateData.background_image = editable.imageFile;
      } else if (editable.image !== undefined) {
        updateData.background_image = editable.image;
      }
      if (editable.overlayOpacity !== undefined) {
        updateData.opacity = (editable.overlayOpacity / 100).toString();
      }
      if (editable.status !== undefined) {
        updateData.status = editable.status;
      }

      await updateHeroSection({ id: slide.id, data: updateData }).unwrap();

      setEditableSlides(prev => {
        const newState = { ...prev };
        delete newState[slide.id];
        return newState;
      });

      refetch();
    } catch (error) {
      console.error("Failed to update slide:", error);
      alert("Failed to update slide. Please try again.");
    } finally {
      setUpdatingSlides(prev => ({ ...prev, [slide.id]: false }));
    }
  };

  const handleCreateSlide = async (draft: DraftSlide) => {
    setCreatingSlides(prev => ({ ...prev, [draft.id]: true }));

    try {
      const createData: {
        title: string;
        subtitle: string;
        background_image: string | File;
        opacity: string;
        serial: string;
        status: 'active' | 'inactive';
      } = {
        title: draft.title || "",
        subtitle: draft.subtitle || "",
        background_image: draft.imageFile || draft.image || "",
        opacity: (draft.overlayOpacity / 100).toString(),
        serial: draft.serial,
        status: draft.status,
      };

      const result = await createHeroSection(createData).unwrap();

      if (result.data?.id) {
        setNewSlideId(result.data.id);
      }

      // Remove draft from list
      setDraftSlides(prev => prev.filter(s => s.id !== draft.id));

      refetch();
    } catch (error) {
      console.error("Failed to create slide:", error);
      alert("Failed to create slide. Please try again.");
    } finally {
      setCreatingSlides(prev => {
        const newState = { ...prev };
        delete newState[draft.id];
        return newState;
      });
    }
  };

  const handleCancelDraft = (draftId: string) => {
    setDraftSlides(prev => prev.filter(s => s.id !== draftId));
  };

  const handleDraftFieldChange = <T extends keyof DraftSlide>(draftId: string, field: T, value: DraftSlide[T]) => {
    setDraftSlides(prev => prev.map(draft =>
      draft.id === draftId ? { ...draft, [field]: value } : draft
    ));
  };

  const handleDraftImageChange = (draftId: string, file: File | null) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setDraftSlides(prev => prev.map(draft =>
      draft.id === draftId
        ? { ...draft, imageFile: file, image: previewUrl }
        : draft
    ));
  };

  const handleStatusChange = async (id: number, status: 'active' | 'inactive') => {
    try {
      await setHeroSectionActive({ id, status }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const moveSlide = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === slides.length - 1)
    ) {
      return;
    }

    try {
      const newSlides = [...slides];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      const tempSerial = newSlides[index].serial;
      newSlides[index].serial = newSlides[targetIndex].serial;
      newSlides[targetIndex].serial = tempSerial;

      await Promise.all([
        updateHeroSection({
          id: newSlides[index].id,
          data: { serial: newSlides[index].serial },
        }).unwrap(),
        updateHeroSection({
          id: newSlides[targetIndex].id,
          data: { serial: newSlides[targetIndex].serial },
        }).unwrap(),
      ]);

      refetch();
    } catch (error) {
      console.error("Failed to reorder slides:", error);
      alert("Failed to reorder slides. Please try again.");
    }
  };

  const nextPreview = () => {
    setCurrentPreviewIndex((prev) => (prev + 1) % slides.length);
  };

  const prevPreview = () => {
    setCurrentPreviewIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load hero sections. Please try again.</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hero Slider Management</h2>
        <p className="text-gray-600">Edit and manage your home page hero slider slides</p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          onClick={addSlide}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Slide
        </Button>
        <Button
          onClick={() => setShowPreview(true)}
          variant="outline"
          className="flex items-center gap-2"
          disabled={slides.length === 0 || draftSlides.length > 0}
        >
          <Eye className="h-4 w-4" />
          Preview Slider
        </Button>
      </div>

      {slides.length === 0 && draftSlides.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No hero sections found. Add your first slide to get started.</p>
          <Button onClick={addSlide} className="flex items-center gap-2 mx-auto">
            <Plus className="h-4 w-4" />
            Add New Slide
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Render draft slides first */}
          {draftSlides.map((draft) => (
            <Card
              key={draft.id}
              id={`slide-${draft.id}`}
              className="overflow-hidden border-2 border-dashed border-blue-300"
            >
              <CardHeader className="bg-blue-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-blue-700">New Slide (Draft)</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleCreateSlide(draft)}
                      disabled={creatingSlides[draft.id]}
                      className="h-8 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {creatingSlides[draft.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span className="ml-1">Create</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCancelDraft(draft.id)}
                      disabled={creatingSlides[draft.id]}
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    {draft.image ? (
                      <>
                        <img
                          src={draft.image}
                          alt="Draft slide"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/vite.svg";
                          }}
                        />
                        <div
                          className="absolute inset-0 bg-gray-950"
                          style={{ opacity: `${draft.overlayOpacity}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="text-center text-white">
                            <h3 className="text-xl font-bold mb-2">{draft.title || "Title"}</h3>
                            <p className="text-sm">{draft.subtitle || "Subtitle"}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <p>No image selected</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Field>
                    <FieldLabel>Background Image</FieldLabel>
                    <FieldContent>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleDraftImageChange(draft.id, file);
                            }
                          }}
                          disabled={creatingSlides[draft.id]}
                          className="cursor-pointer"
                        />
                        {draft.imageFile && (
                          <p className="text-xs text-green-600 mt-1">
                            Image selected: {draft.imageFile.name}
                          </p>
                        )}
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <FieldContent>
                      <Input
                        value={draft.title}
                        onChange={(e) => handleDraftFieldChange(draft.id, 'title', e.target.value)}
                        placeholder="Trusted Medical Care"
                        disabled={creatingSlides[draft.id]}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Subtitle</FieldLabel>
                    <FieldContent>
                      <Input
                        value={draft.subtitle}
                        onChange={(e) => handleDraftFieldChange(draft.id, 'subtitle', e.target.value)}
                        placeholder="Personalized Results"
                        disabled={creatingSlides[draft.id]}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Overlay Opacity: {draft.overlayOpacity}%</FieldLabel>
                    <FieldContent>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={draft.overlayOpacity}
                        onChange={(e) => handleDraftFieldChange(draft.id, 'overlayOpacity', parseInt(e.target.value))}
                        className="w-full"
                        disabled={creatingSlides[draft.id]}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <FieldContent>
                      <select
                        value={draft.status}
                        onChange={(e) => handleDraftFieldChange(draft.id, 'status', e.target.value as 'active' | 'inactive')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={creatingSlides[draft.id]}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </FieldContent>
                  </Field>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Render existing slides */}
          {slides.map((slide, index) => (
            <Card
              key={slide.id}
              className="overflow-hidden"
              ref={(el) => {
                slideRefs.current[slide.id] = el;
              }}
            >
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Slide {index + 1}</CardTitle>
                  <div className="flex items-center gap-2">
                    {hasChanges(slide) && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateSlide(slide)}
                        disabled={updatingSlides[slide.id]}
                        className="h-8 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {updatingSlides[slide.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        <span className="ml-1">Update</span>
                      </Button>
                    )}
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
                      onClick={() => handleDeleteClick(slide.id)}
                      disabled={slides.length === 1}
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <img
                      src={getSlideValue(slide, 'image') || slide.image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/vite.svg";
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-gray-950"
                      style={{ opacity: `${getSlideValue(slide, 'overlayOpacity') ?? slide.overlayOpacity}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="text-center text-white">
                        <h3 className="text-xl font-bold mb-2">{getSlideValue(slide, 'title') || slide.title}</h3>
                        <p className="text-sm">{getSlideValue(slide, 'subtitle') || slide.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Field>
                    <FieldLabel>Background Image</FieldLabel>
                    <FieldContent>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageChange(slide.id, file);
                            }
                          }}
                          disabled={updatingSlides[slide.id]}
                          className="cursor-pointer"
                        />
                        {slide.image && !editableSlides[slide.id]?.imageFile && (
                          <p className="text-xs text-gray-500 mt-1">
                            Current: {slide.image}
                          </p>
                        )}
                        {editableSlides[slide.id]?.imageFile && (
                          <p className="text-xs text-green-600 mt-1">
                            New image selected: {editableSlides[slide.id].imageFile?.name}
                          </p>
                        )}
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <FieldContent>
                      <Input
                        value={getSlideValue(slide, 'title') || slide.title}
                        onChange={(e) => handleFieldChange(slide.id, 'title', e.target.value)}
                        placeholder="Trusted Medical Care"
                        disabled={updatingSlides[slide.id]}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Subtitle</FieldLabel>
                    <FieldContent>
                      <Input
                        value={getSlideValue(slide, 'subtitle') || slide.subtitle}
                        onChange={(e) => handleFieldChange(slide.id, 'subtitle', e.target.value)}
                        placeholder="Personalized Results"
                        disabled={updatingSlides[slide.id]}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Overlay Opacity: {getSlideValue(slide, 'overlayOpacity') ?? slide.overlayOpacity}%</FieldLabel>
                    <FieldContent>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={getSlideValue(slide, 'overlayOpacity') ?? slide.overlayOpacity}
                        onChange={(e) => handleFieldChange(slide.id, 'overlayOpacity', parseInt(e.target.value))}
                        className="w-full"
                        disabled={updatingSlides[slide.id]}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <FieldContent>
                      <select
                        value={getSlideValue(slide, 'status') || slide.status}
                        onChange={(e) => handleFieldChange(slide.id, 'status', e.target.value as 'active' | 'inactive')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={updatingSlides[slide.id]}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </FieldContent>
                  </Field>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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

            <div className="relative w-full h-full overflow-hidden">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${index === currentPreviewIndex ? "opacity-100" : "opacity-0"
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

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPreviewIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentPreviewIndex
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

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        title="Delete Slide"
        description="Are you sure you want to delete this slide? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}

