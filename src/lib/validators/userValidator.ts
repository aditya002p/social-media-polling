import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
} from "../constants";

/**
 * Schema for user registration
 */
export const registerUserSchema = z
  .object({
    username: z
      .string()
      .min(
        USERNAME_MIN_LENGTH,
        `Username must be at least ${USERNAME_MIN_LENGTH} characters`
      )
      .max(
        USERNAME_MAX_LENGTH,
        `Username must be less than ${USERNAME_MAX_LENGTH} characters`
      )
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Invalid email address").toLowerCase(),
    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
      )
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Schema for user login
 */
export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

/**
 * Schema for updating user profile
 */
export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be less than 50 characters")
    .optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters")
    .optional(),
  website: z
    .string()
    .url("Invalid URL")
    .max(200, "Website URL must be less than 200 characters")
    .optional()
    .nullable(),
  avatarUrl: z.string().url("Invalid URL").optional().nullable(),
  coverImageUrl: z.string().url("Invalid URL").optional().nullable(),
  socialLinks: z.record(z.string().url("Invalid URL")).optional(),
  interests: z
    .array(z.string())
    .max(10, "Maximum 10 interests allowed")
    .optional(),
});

/**
 * Schema for changing password
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
      )
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

/**
 * Schema for requesting password reset
 */
export const requestPasswordResetSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
});

/**
 * Schema for resetting password
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
      )
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Schema for user privacy settings
 */
export const privacySettingsSchema = z.object({
  profileVisibility: z.enum([
    "public",
    "registeredUsers",
    "followers",
    "private",
  ]),
  allowDirectMessages: z.enum(["everyone", "followers", "none"]),
  showOnlineStatus: z.boolean(),
  allowTagging: z.boolean(),
  showActivityStatus: z.boolean(),
  allowDataCollection: z.boolean(),
});

/**
 * Schema for notification settings
 */
export const notificationSettingsSchema = z.object({
  email: z.object({
    pollResponses: z.boolean(),
    comments: z.boolean(),
    mentions: z.boolean(),
    directMessages: z.boolean(),
    pollInvites: z.boolean(),
    systemAnnouncements: z.boolean(),
    marketing: z.boolean(),
  }),
  push: z.object({
    pollResponses: z.boolean(),
    comments: z.boolean(),
    mentions: z.boolean(),
    directMessages: z.boolean(),
    pollInvites: z.boolean(),
    systemAnnouncements: z.boolean(),
  }),
  inApp: z.object({
    pollResponses: z.boolean(),
    comments: z.boolean(),
    mentions: z.boolean(),
    directMessages: z.boolean(),
    pollInvites: z.boolean(),
    systemAnnouncements: z.boolean(),
  }),
});

/**
 * Type for user registration
 */
export type RegisterUserInput = z.infer<typeof registerUserSchema>;

/**
 * Type for user login
 */
export type LoginUserInput = z.infer<typeof loginUserSchema>;

/**
 * Type for updating user profile
 */
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Type for changing password
 */
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Type for requesting password reset
 */
export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;

/**
 * Type for resetting password
 */
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Type for user privacy settings
 */
export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>;

/**
 * Type for notification settings
 */
export type NotificationSettingsInput = z.infer<
  typeof notificationSettingsSchema
>;

/**
 * Validate user registration input
 * @param input The user registration input
 * @returns Validation result
 */
export const validateRegisterUser = (
  input: any
): {
  success: boolean;
  data?: RegisterUserInput;
  error?: z.ZodError;
} => {
  try {
    const validatedData = registerUserSchema.parse(input);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

/**
 * Validate user login input
 * @param input The user login input
 * @returns Validation result
 */
export const validateLoginUser = (
  input: any
): {
  success: boolean;
  data?: LoginUserInput;
  error?: z.ZodError;
} => {
  try {
    const validatedData = loginUserSchema.parse(input);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
};

/**
 * Validate update profile input
 * @param input The update profile input
 * @returns Validation result
 */
export const validateUpdateProfile = (
  input: any
): {
  success: boolean;
  data?: UpdateProfileInput;
  error?: z.ZodError;
} => {
  try {
    const validatedData = updateProfileSchema.parse(input);
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
export const formatUserValidationErrors = (
  error: z.ZodError
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const issue of error.errors) {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  }

  return errors;
};
