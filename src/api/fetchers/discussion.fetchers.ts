import { DiscussionProperties } from '@/db/models/nodes';
import { ensureAuth } from '@/api/auth.api';
import { findAdHocDiscussions } from '@/db/repositories/discussion.repository';

/**
 * Get ad-hoc discussions for a book club
 *
 * @param {string} bookClubSlug - The slug of the book club
 * @return {Promise<DiscussionProperties[]>}
 */
export const getAdHocDiscussions = async (
  bookClubSlug: string
): Promise<DiscussionProperties[]> => {
  // Ensure the user is authenticated and get their email
  const { email } = await ensureAuth();

  // Fetch and return the discussions
  return await findAdHocDiscussions(bookClubSlug, email);
};
