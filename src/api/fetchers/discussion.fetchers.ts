import { DiscussionPreview, DiscussionProperties, ReplyWithUser } from '@/db/models/nodes';
import { ensureAuth } from '@/api/auth.api';
import {
  countDiscussionReplies,
  findAdHocDiscussions,
  findDiscussion,
  findDiscussionReplies
} from '@/db/repositories/discussion.repository';
import { toJSON } from '@/util/helpers';

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

/**
 * Get a paginated list of discussion replies along with the total number of replies
 *
 * @param {string} bookClubSlug The slug of the book club
 * @param {string} discussionID The ID of the discussion
 * @param {number} pageSize The number of results to return in a page
 * @param {number} pageNum The page number
 * @return {Promise<ReplyWithUser>[]} The replies and total
 */
export const getDiscussionReplies = async (
  bookClubSlug: string,
  discussionID: string,
  pageSize: number,
  pageNum: number
): Promise<ReplyWithUser[]> => {
  // Ensure the user is authenticated and get their email
  const { email } = await ensureAuth();

  // Fetch and return a page of replies for the discussion
  return toJSON(await findDiscussionReplies(bookClubSlug, discussionID, email, pageSize, pageNum)) as ReplyWithUser[];
};

/** Get the total number of replies for a given discussion
 *
 * @param {string} bookClubSlug The slug of the book club
 * @param {string} discussionID The ID of the discussion
 * @return {Promise<number>} The total number of replies
 */
export const getDiscussionReplyCount = async (
  bookClubSlug: string,
  discussionID: string
): Promise<number> => {
  // Ensure the user is authenticated and get their email
  const { email } = await ensureAuth();

  // Fetch and return a page of replies for the discussion
  return await countDiscussionReplies(bookClubSlug, discussionID, email);
};

