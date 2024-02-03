import { ensureAuth } from '@/api/auth.api';
import { hasOpenRequest as fetchHasOpenRequest } from '@/db/repositories/membership-request.repository';

/**
 * Find whether a user has an open membership request for a given book club
 *
 * @param {string} slug The slug of the book club
 * @return {Promise<boolean>} Whether the user has an open membership request
 */
export const hasOpenRequest = async (slug: string): Promise<boolean> => {
  // Ensure that the user is authenticated
  const user = await ensureAuth();

  // Fetch the user's open request presence
  return await fetchHasOpenRequest(slug, user.email);
};
