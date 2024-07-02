import { ensureAuth } from '@/api/auth.api';
import { UserAndMembership } from '@/db/models/nodes';
import { findBookClubPickList } from '@/db/repositories/membership.repository';
import { toJSON } from '@/util/helpers';

/**
 * Get the pick list for a book club
 *
 * @param {string} slug The slug of the book club
 * @return {Promise<UserAndMembership[]>} The pick list
 */
export const getBookClubPickList = async (slug: string): Promise<UserAndMembership[]> => {
  // Ensure the user is authenticated and pull out their email
  const { email } = await ensureAuth();

  // Fetch and return the pick list, dropping the last entry (a duplicate of the first since the list is circular)
  return toJSON((await findBookClubPickList(slug, email)).slice(0, -1)) as UserAndMembership[];
};
