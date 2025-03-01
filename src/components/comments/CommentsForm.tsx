import React, { useState, useRef, useEffect } from "react";
import { Button, Textarea } from "../ui/";
import useAuth from "@/hooks/useAuth";
import { Avatar } from "../ui/Avatar";
import useComment from "@/hooks/useComment";
import LoadingSpinner from "../shared/LoadingSpinner";

interface CommentFormProps {
  parentId?: string;
  pollId?: string;
  opinionId?: string;
  initialValue?: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  autoFocus?: boolean;
  submitLabel?: string;
  placeholder?: string;
  maxLength?: number;
}

const CommentForm: React.FC<CommentFormProps> = ({
  parentId,
  pollId,
  opinionId,
  initialValue = "",
  onSubmit,
  onCancel,
  autoFocus = false,
  submitLabel = "Post",
  placeholder = "Write a comment...",
  maxLength = 1000,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { addComment } = useComment();
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(initialValue.length);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setContent(value);
      setCharCount(value.length);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    if (content.length > maxLength) {
      setError(`Comment exceeds maximum length of ${maxLength} characters.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (parentId || pollId || opinionId) {
        // If we have a parent id or content id, use the hook to add a comment
        await addComment({
          content,
          parentId,
          pollId,
          opinionId,
        });
      }

      // In any case, call the onSubmit provided by the parent component
      await onSubmit(content);

      // Clear the form after successful submission
      setContent("");
      setCharCount(0);
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-gray-50 rounded-md text-center">
        <p className="text-gray-600 mb-2">Please sign in to leave a comment.</p>
        <Button variant="default" size="sm" href="/login">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Avatar
            src={user?.avatarUrl}
            fallback={user?.name?.[0] || "U"}
            alt={user?.name || "User"}
          />
        </div>
        <div className="flex-grow">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextChange}
            placeholder={placeholder}
            rows={3}
            disabled={isSubmitting}
            aria-label="Comment content"
            className="w-full resize-y min-h-[100px]"
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <span
                className={charCount > maxLength * 0.9 ? "text-orange-500" : ""}
              >
                {charCount}
              </span>
              /{maxLength} characters
            </div>

            <div className="flex space-x-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}

              <Button
                type="submit"
                variant="default"
                size="sm"
                disabled={
                  isSubmitting ||
                  content.trim().length === 0 ||
                  content.length > maxLength
                }
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : submitLabel}
              </Button>
            </div>
          </div>

          {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
