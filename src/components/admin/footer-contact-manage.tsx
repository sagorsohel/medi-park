"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Loader2, RefreshCw, Mail, Phone, Plus, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetFooterContactQuery,
  useCreateUpdateFooterContactMutation,
} from "@/services/contactPageApi";

type FormState = {
  email: string;
  phone: string[];
  status: "active" | "inactive";
};

const initialState: FormState = {
  email: "",
  phone: [""],
  status: "active",
};

export function FooterContactManage() {
  const { data, isLoading, error, refetch } = useGetFooterContactQuery();
  const [createUpdateFooterContact, { isLoading: saving }] = useCreateUpdateFooterContactMutation();

  const [formState, setFormState] = useState<FormState>(initialState);
  const [hasChanges, setHasChanges] = useState(false);
  const lastSyncedTimestampRef = useRef<string | null>(null);

  useEffect(() => {
    if (data?.data) {
      const contact = data.data;
      // Only sync from API if no local changes or if this is new data
      const isNewData = lastSyncedTimestampRef.current !== contact.updated_at;
      if ((!hasChanges || lastSyncedTimestampRef.current === null) && isNewData) {
        lastSyncedTimestampRef.current = contact.updated_at;
        // Defer state update to avoid synchronous setState in effect warning
        setTimeout(() => {
          setFormState({
            email: contact.email || "",
            phone: contact.phone && contact.phone.length > 0 ? contact.phone : [""],
            status: contact.status || "active",
          });
          setHasChanges(false);
        }, 0);
      }
    }
  }, [data, hasChanges]);

  const handleEmailChange = (value: string) => {
    setFormState((prev) => ({ ...prev, email: value }));
    setHasChanges(true);
  };

  const handlePhoneChange = (index: number, value: string) => {
    setFormState((prev) => {
      const newPhone = [...prev.phone];
      newPhone[index] = value;
      return { ...prev, phone: newPhone };
    });
    setHasChanges(true);
  };

  const handleAddPhone = () => {
    setFormState((prev) => ({ ...prev, phone: [...prev.phone, ""] }));
    setHasChanges(true);
  };

  const handleRemovePhone = (index: number) => {
    if (formState.phone.length <= 1) {
      toast.error("At least one phone number is required.");
      return;
    }
    setFormState((prev) => {
      const newPhone = prev.phone.filter((_, i) => i !== index);
      return { ...prev, phone: newPhone };
    });
    setHasChanges(true);
  };

  const handleStatusChange = (value: "active" | "inactive") => {
    setFormState((prev) => ({ ...prev, status: value }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    // Validate email
    if (!formState.email || !formState.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Validate phone numbers (filter out empty ones)
    const validPhones = formState.phone.filter((p) => p.trim() !== "");
    if (validPhones.length === 0) {
      toast.error("Please enter at least one phone number.");
      return;
    }

    try {
      await createUpdateFooterContact({
        email: formState.email,
        phone: validPhones,
        status: formState.status,
      }).unwrap();
      toast.success("Footer contact saved successfully!");
      setHasChanges(false);
      refetch();
    } catch (err) {
      console.error("Failed to save footer contact:", err);
      toast.error("Failed to save footer contact. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-10">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (error && !data) {
    return (
      <Card className="mt-10">
        <CardContent className="space-y-4 py-6">
          <p className="text-red-700">Failed to load footer contact. Please retry.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-10">
      <CardHeader className="bg-gray-50 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Footer Contact Management
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </CardHeader>

      <CardContent className="space-y-6 pt-6 p-6">
        <Field>
          <FieldLabel className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </FieldLabel>
          <FieldContent>
            <Input
              type="email"
              value={formState.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Enter email address"
              disabled={saving}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Numbers
          </FieldLabel>
          <FieldContent>
            <div className="space-y-3">
              {formState.phone.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    placeholder={`Phone ${index + 1}`}
                    disabled={saving}
                    className="flex-1"
                  />
                  {formState.phone.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemovePhone(index)}
                      disabled={saving}
                      className="shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddPhone}
                disabled={saving}
                className="w-full flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Phone Number
              </Button>
            </div>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Status</FieldLabel>
          <FieldContent>
            <select
              value={formState.status}
              onChange={(e) => handleStatusChange(e.target.value as "active" | "inactive")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={saving}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </FieldContent>
        </Field>

        <div className="flex items-center gap-4 pt-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>

          {hasChanges && (
            <Button
              variant="outline"
              onClick={() => {
                if (data?.data) {
                  const contact = data.data;
                  setFormState({
                    email: contact.email || "",
                    phone: contact.phone && contact.phone.length > 0 ? contact.phone : [""],
                    status: contact.status || "active",
                  });
                  setHasChanges(false);
                }
              }}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset Changes
            </Button>
          )}
        </div>

        {data?.data && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Last updated:</strong>{" "}
              {new Date(data.data.updated_at).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

