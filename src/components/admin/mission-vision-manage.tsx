"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Loader2, RefreshCw } from "lucide-react";
import {
  useGetMissionQuery,
  useGetVisionQuery,
  useUpdateMissionMutation,
  useUpdateVisionMutation,
  type UpdateMissionVisionPayload,
} from "@/services/aboutPageApi";

interface EditableMVState {
  title: string;
  paragraph: string;
  image?: string;
  imageFile?: File;
  status: "active" | "inactive";
}

function SectionCard({
  label,
  editable,
  onChange,
  onFile,
  onSave,
  saving,
  loading,
  error,
  refetch,
}: {
  label: string;
  editable: EditableMVState | null;
  onChange: (field: keyof EditableMVState, value: string) => void;
  onFile: (file: File | null) => void;
  onSave: () => void;
  saving: boolean;
  loading: boolean;
  error: boolean;
  refetch: () => void;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (error || !editable) {
    return (
      <Card>
        <CardContent className="space-y-3 py-6">
          <p className="text-red-700">Failed to load {label}. Please retry.</p>
          <Button onClick={refetch}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-gray-50 flex flex-row items-center justify-between">
        <CardTitle>{label}</CardTitle>
        <Button onClick={onSave} disabled={saving} className="flex items-center gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Save
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Preview similar to website section */}
        <div className="w-full">
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {editable.title || label}
            </h2>
            <div className="w-0.5 h-8 bg-gray-600 mx-auto mt-2" />
          </div>
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-5xl rounded-[12px] overflow-hidden shadow-sm border border-gray-200">
              {editable.image ? (
                <img
                  src={editable.image}
                  alt={editable.title || label}
                  className="w-full h-[280px] p-4 rounded-[12px] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/vite.svg";
                  }}
                />
              ) : (
                <div className="w-full h-[280px] flex items-center justify-center text-gray-400 bg-gray-50">
                  No image
                </div>
              )}
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-2">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">
              {editable.paragraph || "Add description here..."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel>Title</FieldLabel>
            <FieldContent>
              <Input
                value={editable.title}
                onChange={(e) => onChange("title", e.target.value)}
                placeholder="Enter title"
                disabled={saving}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <FieldContent>
              <select
                value={editable.status}
                onChange={(e) => onChange("status", e.target.value as "active" | "inactive")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel>Paragraph</FieldLabel>
          <FieldContent>
            <textarea
              value={editable.paragraph}
              onChange={(e) => onChange("paragraph", e.target.value)}
              placeholder="Enter description"
              className="w-full min-h-[120px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Image</FieldLabel>
          <FieldContent>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              disabled={saving}
              className="cursor-pointer"
            />
            {editable.imageFile && (
              <p className="text-xs text-green-600 mt-1">New image selected: {editable.imageFile.name}</p>
            )}
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  );
}

export function MissionVisionManage() {
  const { data: missionData, isLoading: missionLoading, error: missionError, refetch: refetchMission } = useGetMissionQuery();
  const { data: visionData, isLoading: visionLoading, error: visionError, refetch: refetchVision } = useGetVisionQuery();
  const [updateMission, { isLoading: savingMission }] = useUpdateMissionMutation();
  const [updateVision, { isLoading: savingVision }] = useUpdateVisionMutation();

  const missionRecord = useMemo(() => missionData?.data, [missionData]);
  const visionRecord = useMemo(() => visionData?.data, [visionData]);

  const [missionEdit, setMissionEdit] = useState<EditableMVState | null>(null);
  const [visionEdit, setVisionEdit] = useState<EditableMVState | null>(null);

  useEffect(() => {
    if (missionRecord) {
      setMissionEdit({
        title: missionRecord.title ?? "",
        paragraph: missionRecord.paragraph ?? "",
        image: missionRecord.image ?? "",
        status: missionRecord.status ?? "inactive",
      });
    }
  }, [missionRecord]);

  useEffect(() => {
    if (visionRecord) {
      setVisionEdit({
        title: visionRecord.title ?? "",
        paragraph: visionRecord.paragraph ?? "",
        image: visionRecord.image ?? "",
        status: visionRecord.status ?? "inactive",
      });
    }
  }, [visionRecord]);

  const saveMission = async () => {
    if (!missionRecord || !missionEdit) return;
    const payload: UpdateMissionVisionPayload = {};
    if (missionEdit.title !== missionRecord.title) payload.title = missionEdit.title;
    if (missionEdit.paragraph !== missionRecord.paragraph) payload.paragraph = missionEdit.paragraph;
    if (missionEdit.status !== missionRecord.status) payload.status = missionEdit.status;
    if (missionEdit.imageFile) payload.image = missionEdit.imageFile;
    try {
      await updateMission({ id: missionRecord.id, data: payload }).unwrap();
      await refetchMission();
    } catch (err) {
      console.error("Failed to update mission", err);
      alert("Failed to update mission. Please try again.");
    }
  };

  const saveVision = async () => {
    if (!visionRecord || !visionEdit) return;
    const payload: UpdateMissionVisionPayload = {};
    if (visionEdit.title !== visionRecord.title) payload.title = visionEdit.title;
    if (visionEdit.paragraph !== visionRecord.paragraph) payload.paragraph = visionEdit.paragraph;
    if (visionEdit.status !== visionRecord.status) payload.status = visionEdit.status;
    if (visionEdit.imageFile) payload.image = visionEdit.imageFile;
    try {
      await updateVision({ id: visionRecord.id, data: payload }).unwrap();
      await refetchVision();
    } catch (err) {
      console.error("Failed to update vision", err);
      alert("Failed to update vision. Please try again.");
    }
  };

  return (
    <div className="mb-10 pt-8 space-y-8">
      <div className="p-5">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Mission & Vision</h2>
        <p className="text-gray-600">Manage the mission and vision sections displayed on the About page.</p>
      </div>

      <SectionCard
        label="Our Mission"
        editable={missionEdit}
        onChange={(field, value) => setMissionEdit((prev) => (prev ? { ...prev, [field]: value } : prev))}
        onFile={(file) =>
          setMissionEdit((prev) =>
            prev
              ? {
                  ...prev,
                  imageFile: file || undefined,
                  image: file ? URL.createObjectURL(file) : prev.image,
                }
              : prev,
          )
        }
        onSave={saveMission}
        saving={savingMission}
        loading={missionLoading}
        error={!!missionError}
        refetch={refetchMission}
      />

      <SectionCard
        label="Our Vision"
        editable={visionEdit}
        onChange={(field, value) => setVisionEdit((prev) => (prev ? { ...prev, [field]: value } : prev))}
        onFile={(file) =>
          setVisionEdit((prev) =>
            prev
              ? {
                  ...prev,
                  imageFile: file || undefined,
                  image: file ? URL.createObjectURL(file) : prev.image,
                }
              : prev,
          )
        }
        onSave={saveVision}
        saving={savingVision}
        loading={visionLoading}
        error={!!visionError}
        refetch={refetchVision}
      />
    </div>
  );
}

