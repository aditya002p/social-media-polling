import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/FormElements/Input";
import { Textarea } from "../ui/FormElements/Textarea";
import { Checkbox } from "../ui/FormElements/Checkbox";
import { Select } from "../ui/FormElements/Select";
import { Card } from "../ui/Card";
import { AlertCircle, Upload } from "lucide-react";
import { Alert, AlertDescription } from "../ui/Alert";

interface GroupFormProps {
  initialData?: {
    name: string;
    description: string;
    isPrivate: boolean;
    topics: string[];
    coverImage?: string;
  };
  onSubmit: (data: FormData) => Promise<void>;
  isEditing?: boolean;
  availableTopics: string[];
}

export const GroupForm: React.FC<GroupFormProps> = ({
  initialData = { name: "", description: "", isPrivate: false, topics: [] },
  onSubmit,
  isEditing = false,
  availableTopics,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState("");
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    initialData.coverImage
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTopics = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({ ...prev, topics: selectedTopics }));
  };

  const handleAddCustomTopic = () => {
    if (customTopic.trim() && !formData.topics.includes(customTopic.trim())) {
      setFormData((prev) => ({
        ...prev,
        topics: [...prev.topics, customTopic.trim()],
      }));
      setCustomTopic("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name.trim()) {
        throw new Error("Group name is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }

      // Create FormData to handle file upload
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("isPrivate", formData.isPrivate.toString());
      formData.topics.forEach((topic, index) => {
        submitData.append(`topics[${index}]`, topic);
      });

      if (selectedFile) {
        submitData.append("coverImage", selectedFile);
      }

      await onSubmit(submitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Group" : "Create New Group"}
      </h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Group Name
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter group name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what this group is about"
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Checkbox
              id="isPrivate"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="isPrivate" className="ml-2 text-sm font-medium">
              Make this group private
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Private groups are only visible to members and require approval to
            join.
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="topics" className="block text-sm font-medium mb-1">
            Topics
          </label>
          <Select
            id="topics"
            multiple
            value={formData.topics.filter((topic) =>
              availableTopics.includes(topic)
            )}
            onChange={handleTopicChange}
            className="h-32"
          >
            {availableTopics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </Select>
          <div className="flex mt-2">
            <Input
              placeholder="Add custom topic"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="mr-2"
            />
            <Button
              type="button"
              onClick={handleAddCustomTopic}
              variant="outline"
            >
              Add
            </Button>
          </div>
          {formData.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.topics.map((topic) => (
                <div
                  key={topic}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm"
                >
                  {topic}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        topics: prev.topics.filter((t) => t !== topic),
                      }));
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Cover Image</label>
          <div className="mt-1 flex items-center">
            {previewImage ? (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Cover preview"
                  className="h-32 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(undefined);
                    setSelectedFile(null);
                  }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                >
                  &times;
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Click to upload cover image
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Submitting..."
              : isEditing
              ? "Update Group"
              : "Create Group"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default GroupForm;
