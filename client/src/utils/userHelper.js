/**
 * User and Author Helper Utility
 * Provides consistent author and user information across the application.
 */

/**
 * Resolves the author details for community posts, comments, and profile interactions.
 * Priority:
 * 1. currentUser.name
 * 2. currentUser.fullName
 * 3. currentUser.username
 * 4. localStorage stored user details
 * 5. Fallback: "Community Member"
 *
 * @param {Object|null} currentUser - The currently authenticated user object from AuthContext
 * @returns {{ name: string, avatar: string, role: string }}
 */
export const getAuthorDetails = (currentUser) => {
  let name = currentUser?.name || currentUser?.fullName || currentUser?.username;
  let role = currentUser?.headline || currentUser?.role;
  let avatar = currentUser?.avatar;

  // If not found in memory, check localStorage for 'user'
  if (!name) {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        name = parsed?.name || parsed?.fullName || parsed?.username;
        role = role || parsed?.headline || parsed?.role;
        avatar = avatar || parsed?.avatar;
      }
    } catch (e) {
      console.error('Error reading user from localStorage:', e);
    }
  }

  // Ensure clean string values
  const finalName = name && typeof name === 'string' && name.trim().length > 0
    ? name.trim()
    : 'Community Member';

  let finalRole = role && typeof role === 'string' && role.trim().length > 0
    ? role.trim()
    : 'Student';

  if (finalRole.toLowerCase() === 'user') finalRole = 'Student';
  if (finalRole.toLowerCase() === 'admin') finalRole = 'Community Admin';

  const finalAvatar = avatar || (finalName ? finalName.charAt(0).toUpperCase() : 'U');

  return {
    name: finalName,
    role: finalRole,
    avatar: finalAvatar
  };
};
