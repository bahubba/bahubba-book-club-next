import { DiscussionProperties, DiscussionPreview } from '@/db/models/nodes';
import { ensureAuth } from '@/api/auth.api';
import { findAdHocDiscussions, findDiscussion } from '@/db/repositories/discussion.repository';

/**
 * Get ad-hoc discussions for a book club
 *
 * @param {string} bookClubSlug - The slug of the book club
 * @return {Promise<DiscussionPreview[]>}
 */
export const getAdHocDiscussions = async (
  bookClubSlug: string
): Promise<DiscussionPreview[]> => {
  // Ensure the user is authenticated and get their email
  const { email } = await ensureAuth();

  // Fetch and return the discussions
  return await findAdHocDiscussions(bookClubSlug, email);
};

/**
 * Get a discussion
 *
 * @param {string} bookClubSlug - The slug of the book club
 * @param {string} discussionID - The slug of the discussion
 * @return {Promise<DiscussionProperties>}
 */
export const getDiscussion = async (
  bookClubSlug: string,
  discussionID: string
): Promise<DiscussionProperties> => {
  // Ensure the user is authenticated and get their email
  const { email } = await ensureAuth();

  // Fetch and return the discussion
  return await findDiscussion(bookClubSlug, discussionID, email);
};
