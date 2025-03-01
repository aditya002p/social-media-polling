import { z } from "zod";
import { MAX_COMMENT_LENGTH } from "../constants";

/**
 * Schema for creating a new comment
 */
export const createCommentSchema = z
  .object({
    content: z
      .string()
      .min(1, "Comment content is required")
      .max(
        MAX_COMMENT_LENGTH,
        `Comment must be less than ${MAX_COMMENT_LENGTH} characters`
      ),
    pollId: z.string().optional(),
    opinionId: z.string().optional(),
    parentCommentId: z.string().optional(),
    mediaUrls: z
      .array(z.string().url())
      .max(3, "Maximum 3 media items allowed")
      .optional(),
    isAnonymous: z.boolean().default(false),
  })
  .refine((data) => data.pollId || data.opinionId || data.parentCommentId, {
    message:
      "Comment must be associated with a poll, opinion, or parent comment",
    path: ["pollId"],
  });

/**
 * Schema for updating an existing comment
 */
export const updateCommentSchema = z.object({
  id: z.string().min(1, "Comment ID is required"),
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(
      MAX_COMMENT_LENGTH,
      `Comment must be less than ${MAX_COMMENT_LENGTH} characters`
    ),
  mediaUrls: z
    .array(z.string().url())
    .max(3, "Maximum 3 media items allowed")
    .optional(),
});

/**
 * Schema for comment interaction (like, report, etc.)
 */
export const commentInteractionSchema = z.object({
  commentId: z.string().min(1, "Comment ID is required"),
  action: z.enum(["like", "report"]),
  reason: z.string().optional(), // For reports
});

/**
 * Type for creating a new comment
 */
export type CreateCommentInput = z.infer<typeof createCommentSchema>;

/**
 * Type for updating an existing comment
 */
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;

/**
 * Type for comment interaction
 */
export type CommentInteractionInput = z.infer<typeof commentInteractionSchema>;

/**
 * Validate comment creation input
 * @param input The comment creation input
 * @returns Validation result
 */
export const validateCreateComment = (
  input: any
): {
  success: boolean;
  data?: CreateCommentInput;
  error?: z.ZodError;
} => {
  try {
    const validatedData = createCommentSchema.parse(input);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

/**
 * Validate comment update input
 * @param input The comment update input
 * @returns Validation result
 */
export const validateUpdateComment = (
  input: any
): {
  success: boolean;
  data?: UpdateCommentInput;
  error?: z.ZodError;
} => {
  try {
    const validatedData = updateCommentSchema.parse(input);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

/**
 * Validate comment interaction input
 * @param input The comment interaction input
 * @returns Validation result
 */
export const validateCommentInteraction = (
  input: any
): {
  success: boolean;
  data?: CommentInteractionInput;
  error?: z.ZodError;
} => {
  try {
    const validatedData = commentInteractionSchema.parse(input);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

/**
 * Sanitize comment content
 * @param content The comment content to sanitize
 * @returns Sanitized content
 */
export const sanitizeCommentContent = (content: string): string => {
  // This would typically use a library like DOMPurify
  // Basic implementation for demonstration
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "removed:")
    .replace(/on\w+=/gi, "removed=");
};

/**
 * Format validation errors for client display
 * @param error Zod validation error
 * @returns Formatted error messages
 */
export const formatCommentValidationErrors = (
  error: z.ZodError
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const issue of error.errors) {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  }

  return errors;
};
