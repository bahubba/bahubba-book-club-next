import { ensureAuth } from '../auth.api';
import {
  hasOpenRequest as fetchHasOpenRequest,
  findMembershipRequests
} from '@/db/repositories/membership-request.repository';
import { UserAndMembershipRequest } from '@/db/models/nodes';

/**
 * Find whether a user has an open membership request for a given book club
 *
 * @param {string} slug The slug of the book club
 * @return {Promise<boolean>} Whether the user has an open membership request
 */
export const hasOpenRequest = async (slug: string): Promise<boolean> => {
  // Ensure that the user is authenticated
  const { email } = await ensureAuth();

  // Fetch the user's open request presence
  return await fetchHasOpenRequest(slug, email);
};

// TODO - Restrict to admins and owners? Maybe only for private clubs?
/**
 * Finds membership requests for a book club
 *
 * @param {string} slug The slug of the book club
 * @return {Promise<UserAndMembershipRequest[]>} The membership requests
 */
export const getMembershipRequests = async (
  slug: string
): Promise<UserAndMembershipRequest[]> => {
  // Ensure that the user is authenticated and get their email
  const { email } = await ensureAuth();

  // Fetch the membership requests
  return await findMembershipRequests(slug, email);
};
