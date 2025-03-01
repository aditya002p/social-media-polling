import { z } from "zod";
import { MAX_POLL_OPTIONS, MIN_POLL_OPTIONS } from "../constants";

/**
 * Schema for poll option
 */
export const pollOptionSchema = z.object({
  id: z.string().optional(), // Optional for new options
  text: z
    .string()
    .min(1, "Option text is required")
    .max(200, "Option text must be less than 200 characters"),
  imageUrl: z.string().url().optional().nullable(),
  order: z.number().int().optional(),
});

/**
 * Schema for creating a new poll
 */
export const createPollSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed"),
  options: z
    .array(pollOptionSchema)
    .min(MIN_POLL_OPTIONS, `At least ${MIN_POLL_OPTIONS} options are required`)
    .max(MAX_POLL_OPTIONS, `Maximum ${MAX_POLL_OPTIONS} options allowed`),
  allowMultipleVotes: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  isPrivate: z.boolean().default(false),
  expiresAt: z.string().datetime().optional().nullable(),
  groupId: z.string().optional().nullable(),
  allowOtherOption: z.boolean().default(false),
  showResultsBeforeVoting: z.boolean().default(false),
  requireAuthentication: z.boolean().default(true),
  coverImageUrl: z.string().url().optional().nullable(),
  allowOptionImages: z.boolean().default(false),
});

/**
 * Schema for updating an existing poll
 */
export const updatePollSchema = createPollSchema.partial().extend({
  id: z.string().min(1, "Poll ID is required"),
});

/**
 * Schema for voting on a poll
 */
export const pollVoteSchema = z.object({
  pollId: z.string().min(1, "Poll ID is required"),
  optionIds: z.array(z.string()).min(1, "At least one option must be selected"),
  otherOptionText: z.string().optional(),
});

/**
 * Type for creating a new poll
 */
export type CreatePollInput = z.infer<typeof createPollSchema>;

/**
 * Type for updating an existing poll
 */
export type UpdatePollInput = z.infer<typeof updatePollSchema>;

/**
 * Type for poll option
 */
export type PollOptionInput = z.infer<typeof pollOptionSchema>;

/**
 * Type for voting on a poll
 */
export type PollVoteInput = z.infer<typeof pollVoteSchema>;

/**
 * Validate poll creation input
 * @param input The poll creation input
 * @returns Validation result
 */
export const validateCreatePoll = (
  input: any
): {
  success: boolean;
  data?: CreatePollInput;
  error?: z.ZodError;
} => {
  try {
    const validatedData = createPollSchema.parse(input);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

/**
 * Validate poll update input
 * @param input The poll update input
 * @returns Validation result
 */
export const validateUpdatePoll = (
  input: any
): {
  success: boolean;
  data?: UpdatePollInput;
  error?: z.ZodError;
} => {
  try {
    const validatedData = updatePollSchema.parse(input);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

/**
 * Validate poll vote input
 * @param input The poll vote input
 * @returns Validation result
 */
export const validatePollVote = (
  input: any
): {
  success: boolean;
  data?: PollVoteInput;
  error?: z.ZodError;
} => {
  try {
    const validatedData = pollVoteSchema.parse(input);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

/**
 * Format validation errors for client display
 * @param error Zod validation error
 * @returns Formatted error messages
 */
export const formatPollValidationErrors = (
  error: z.ZodError
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const issue of error.errors) {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  }

  return errors;
};
