"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCw, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetCTASectionQuery,
  useUpdateCTASectionMutation,
} from "@/services/homepageApi";

interface EditableCTASection {
  title?: string;
  sub_title?: string;
  content?: string;
  button_text?: string;
  button_link?: string;
  status?: 'active' | 'inactive';
}

export function CTASectionManage() {
  const { data, isLoading, error, refetch } = useGetCTASectionQuery();
  const [updateCTASection] = useUpdateCTASectionMutation();

  const [editableData, setEditableData] = useState<EditableCTASection>({});
  const [updating, setUpdating] = useState(false);

  // Initialize editable data when data loads
  useEffect(() => {
    if (data?.data) {
      setEditableData({});
    }
  }, [data]);

  const hasChanges = (): boolean => {
    if (!data?.data) return false;
    const section = data.data;

    if (editableData.title !== undefined && editableData.title !== section.title) return true;
    if (editableData.sub_title !== undefined && editableData.sub_title !== section.sub_title) return true;
    if (editableData.content !== undefined && editableData.content !== section.content) return true;
    if (editableData.button_text !== undefined && editableData.button_text !== section.button_text) return true;
    if (editableData.button_link !== undefined && editableData.button_link !== section.button_link) return true;
    if (editableData.status !== undefined && editableData.status !== section.status) return true;

    return false;
  };

  const getValue = (field: 'title' | 'sub_title' | 'content' | 'button_text' | 'button_link' | 'status'): string => {
    if (editableData[field] !== undefined) {
      return editableData[field] as string;
    }
    return data?.data?.[field] || '';
  };

  const handleFieldChange = (field: keyof EditableCTASection, value: string) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!data?.data || !hasChanges()) return;

    setUpdating(true);

    try {
      await updateCTASection({
        id: data.data.id,
        data: editableData,
      }).unwrap();

      setEditableData({});
      refetch();
      toast.success("CTA section updated successfully!");
    } catch (error) {
      console.error("Failed to update CTA section:", error);
      toast.error("Failed to update CTA section. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleReset = () => {
    setEditableData({});
  };

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.data) {
    return (
      <Card className="mt-8">
        <CardContent className="text-center py-12 text-red-500">
          Failed to load CTA section. Please try again.
        </CardContent>
      </Card>
    );
  }

  const section = data.data;

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>CTA Section Management</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={updating}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-4">
        <Field>
          <FieldLabel>Title</FieldLabel>
          <FieldContent>
            <Input
              value={getValue('title')}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Enter CTA title"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Sub Title</FieldLabel>
          <FieldContent>
            <Input
              value={getValue('sub_title')}
              onChange={(e) => handleFieldChange('sub_title', e.target.value)}
              placeholder="Enter sub title"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Content</FieldLabel>
          <FieldContent>
            <Textarea
              value={getValue('content')}
              onChange={(e) => handleFieldChange('content', e.target.value)}
              placeholder="Enter content"
              rows={4}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Button Text</FieldLabel>
          <FieldContent>
            <Input
              value={getValue('button_text')}
              onChange={(e) => handleFieldChange('button_text', e.target.value)}
              placeholder="Enter button text"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Button Link</FieldLabel>
          <FieldContent>
            <Input
              value={getValue('button_link')}
              onChange={(e) => handleFieldChange('button_link', e.target.value)}
              placeholder="Enter button link (e.g., https://example.com)"
              type="url"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Status</FieldLabel>
          <FieldContent>
            <select
              value={editableData.status !== undefined ? editableData.status : section.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </FieldContent>
        </Field>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <Button
            onClick={handleUpdate}
            disabled={!hasChanges() || updating}
            className="flex items-center gap-2"
          >
            {updating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Update CTA Section
              </>
            )}
          </Button>

          {hasChanges() && (
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={updating}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset Changes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

