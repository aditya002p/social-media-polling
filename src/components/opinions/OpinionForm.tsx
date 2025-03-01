import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/FormElements/Input";
import { Textarea } from "../ui/FormElements/Textarea";
import { Card } from "../ui/Card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/Alert";

interface OpinionFormProps {
  initialData?: {
    title: string;
    content: string;
    tags: string[];
  };
  onSubmit: (data: {
    title: string;
    content: string;
    tags: string[];
  }) => Promise<void>;
  isEditing?: boolean;
}

export const OpinionForm: React.FC<OpinionFormProps> = ({
  initialData = { title: "", content: "", tags: [] },
  onSubmit,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.content.trim()) {
        throw new Error("Content is required");
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Opinion" : "Share Your Opinion"}
      </h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title for your opinion"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content
          </label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Share your thoughts..."
            rows={6}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags
          </label>
          <div className="flex">
            <Input
              id="tags"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Add tags (press Enter)"
              className="mr-2"
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              Add
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Submitting..."
              : isEditing
              ? "Update Opinion"
              : "Share Opinion"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default OpinionForm;
