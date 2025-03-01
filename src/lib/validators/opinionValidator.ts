import { z } from "zod";
import { MAX_OPINION_CONTENT_LENGTH } from "../constants";

/**
 * Schema for creating a new opinion
 */
export const createOpinionSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must be less than 150 characters"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(
      MAX_OPINION_CONTENT_LENGTH,
      `Content must be less than ${MAX_OPINION_CONTENT_LENGTH} characters`
    ),
  pollId: z.string().optional(),
  forumThreadId: z.string().optional(),
  groupId: z.string().optional(),
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed").optional(),
  mediaUrls: z
    .array(z.string().url())
    .max(10, "Maximum 10 media items allowed")
    .optional(),
  isAnonymous: z.boolean().default(false),
  isPrivate: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  category: z.string().optional(),
});

/**
 * Schema for updating an existing opinion
 */
export const updateOpinionSchema = createOpinionSchema.partial().extend({
  id: z.string().min(1, "Opinion ID is required"),
});

/**
 * Schema for opinion interaction (like, dislike, etc.)
 */
export const opinionInteractionSchema = z.object({
  opinionId: z.string().min(1, "Opinion ID is required"),
  action: z.enum(["like", "dislike", "bookmark", "report", "share"]),
  reason: z.string().optional(), // For reports
});

/**
 * Type for creating a new opinion
 */
export type CreateOpinionInput = z.infer<typeof createOpinionSchema>;

/**
 * Type for updating an existing opinion
 */
export type UpdateOpinionInput = z.infer<typeof updateOpinionSchema>;

/**
 * Type for opinion interaction
 */
export type OpinionInteractionInput = z.infer<typeof opinionInteractionSchema>;

/**
 * Validate opinion creation input
 * @param input The opinion creation input
 * @returns Validation result
 */
export const validateCreateOpinion = (
  input: any
): {
  success: boolean;
  data?: CreateOpinionInput;
  error?: z.ZodError;
} => {
  try {
    const validatedData = createOpinionSchema.parse(input);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

/**
 * Validate opinion update input
 * @param input The opinion update input
 * @returns Validation result
 */
export const validateUpdateOpinion = (
  input: any
): {
  success: boolean;
  data?: UpdateOpinionInput;
  error?: z.ZodError;
} => {
  try {
    const validatedData = updateOpinionSchema.parse(input);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

/**
 * Validate opinion interaction input
 * @param input The opinion interaction input
 * @returns Validation result
 */
export const validateOpinionInteraction = (
  input: any
): {
  success: boolean;
  data?: OpinionInteractionInput;
  error?: z.ZodError;
} => {
  try {
    const validatedData = opinionInteractionSchema.parse(input);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

/**
 * Sanitize opinion content
 * @param content The opinion content to sanitize
 * @returns Sanitized content
 */
export const sanitizeOpinionContent = (content: string): string => {
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
export const formatOpinionValidationErrors = (
  error: z.ZodError
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const issue of error.errors) {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  }

  return errors;
};
