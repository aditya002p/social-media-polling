import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGroup } from "@/hooks/useGroup";
import { Group } from "@/types/group";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormElements/Input";
import { Textarea } from "@/components/ui/FormElements/Textarea";
import { Checkbox } from "@/components/ui/FormElements/Checkbox";
import { Alert } from "@/components/ui/Alert";

interface GroupFormProps {
  group?: Group;
  isEditing?: boolean;
}

const GroupForm: React.FC<GroupFormProps> = ({ group, isEditing = false }) => {
  const router = useRouter();
  const { createGroup, updateGroup, loading, error } = useGroup();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    rules: "",
    avatarUrl: "",
    bannerUrl: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  useEffect(() => {
    if (isEditing && group) {
      setFormData({
        name: group.name || "",
        description: group.description || "",
        isPrivate: group.isPrivate || false,
        rules: group.rules || "",
        avatarUrl: group.avatarUrl || "",
        bannerUrl: group.bannerUrl || "",
      });
    }
  }, [isEditing, group]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateForm = () => {
    const errors: {
      name?: string;
      description?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = "Group name is required";
    } else if (formData.name.length < 3) {
      errors.name = "Group name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      errors.description = "Group description is required";
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && group) {
        await updateGroup(group.id, formData);
        router.push(`/groups/${group.id}`);
      } else {
        const newGroup = await createGroup(formData);
        router.push(`/groups/${newGroup.id}`);
      }
    } catch (err) {
      console.error("Failed to save group:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert variant="destructive">{error}</Alert>}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Group Name *
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter a name for your group"
            error={validationErrors.name}
          />
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description *
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="What is this group about?"
            error={validationErrors.description}
          />
          {validationErrors.description && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors.description}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="rules" className="block text-sm font-medium mb-1">
            Group Rules
          </label>
          <Textarea
            id="rules"
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            rows={4}
            placeholder="Optional: Set rules for members to follow"
          />
        </div>

        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium mb-1">
            Avatar URL
          </label>
          <Input
            id="avatarUrl"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div>
          <label htmlFor="bannerUrl" className="block text-sm font-medium mb-1">
            Banner URL
          </label>
          <Input
            id="bannerUrl"
            name="bannerUrl"
            value={formData.bannerUrl}
            onChange={handleChange}
            placeholder="https://example.com/banner.jpg"
          />
        </div>

        <div className="flex items-center">
          <Checkbox
            id="isPrivate"
            name="isPrivate"
            checked={formData.isPrivate}
            onChange={handleChange}
          />
          <label htmlFor="isPrivate" className="ml-2 block text-sm">
            Make this group private (only approved members can join)
          </label>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button type="submit" disabled={loading}>
          {isEditing ? "Update Group" : "Create Group"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default GroupForm;
