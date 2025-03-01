import { getCurrentUser } from "../supabase/client";

// Define permission roles and their hierarchy
const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  PREMIUM: "premium",
  USER: "user",
  GUEST: "guest",
};

// Role hierarchy (higher index = more permissions)
const ROLE_HIERARCHY = [
  ROLES.GUEST,
  ROLES.USER,
  ROLES.PREMIUM,
  ROLES.MODERATOR,
  ROLES.ADMIN,
];

// Check if a role has sufficient permissions
export const hasRole = (userRole: string, requiredRole: string): boolean => {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);

  if (userRoleIndex === -1 || requiredRoleIndex === -1) {
    return false;
  }

  return userRoleIndex >= requiredRoleIndex;
};

// Check if the current user has a specific permission
export const hasPermission = async (requiredRole: string): Promise<boolean> => {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  // Get the user's role from metadata or default to 'user'
  const userRole = user.app_metadata?.role || ROLES.USER;

  return hasRole(userRole, requiredRole);
};

// Check if user can edit a resource
export const canEdit = async (resourceOwnerId: string): Promise<boolean> => {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  // User can edit if they are the owner
  if (user.id === resourceOwnerId) {
    return true;
  }

  // Admins and moderators can edit any resource
  const userRole = user.app_metadata?.role || ROLES.USER;
  return hasRole(userRole, ROLES.MODERATOR);
};

// Check if user can delete a resource
export const canDelete = async (resourceOwnerId: string): Promise<boolean> => {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  // User can delete if they are the owner
  if (user.id === resourceOwnerId) {
    return true;
  }

  // Only admins can delete resources they don't own
  const userRole = user.app_metadata?.role || ROLES.USER;
  return hasRole(userRole, ROLES.ADMIN);
};

// Export roles for use elsewhere
export { ROLES };
