/**
 * Utility functions for string manipulation
 */

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncates a string to the specified length with an ellipsis
 */
export const truncate = (str: string, maxLength: number): string => {
  if (!str || typeof str !== "string") return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};

/**
 * Slugifies a string (convert to lowercase, replace spaces with hyphens, remove special chars)
 */
export const slugify = (str: string): string => {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

/**
 * Generates a random string of specified length
 */
export const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

/**
 * Checks if a string is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Extracts hashtags from a string
 */
export const extractHashtags = (str: string): string[] => {
  if (!str || typeof str !== "string") return [];
  const hashtagRegex = /#(\w+)/g;
  const matches = str.match(hashtagRegex);

  if (!matches) return [];
  return matches.map((tag) => tag.slice(1));
};

/**
 * Extracts mentions from a string
 */
export const extractMentions = (str: string): string[] => {
  if (!str || typeof str !== "string") return [];
  const mentionRegex = /@(\w+)/g;
  const matches = str.match(mentionRegex);

  if (!matches) return [];
  return matches.map((mention) => mention.slice(1));
};

/**
 * Strips HTML tags from a string
 */
export const stripHtml = (html: string): string => {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, "");
};
