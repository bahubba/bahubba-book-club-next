'use server';

import { BookClubDoc, Publicity } from '@/db/models/book-club.models';
import {
  findBookClubsBySearch,
  findBookClubsForUser
} from '@/db/repositories/book-club.repository';
import { ensureAuth } from '@/api/auth.api';

/** Retrieves all book clubs for the logged-in user */
export const getBookClubsForUser = async (): Promise<BookClubDoc[]> => {
  // Ensure that the user is authenticated
  const user = await ensureAuth();

  // Fetch the user's book clubs
  return await findBookClubsForUser(user._id);
};

/** Searches for book clubs by name or description */
export const searchBookClubs = async (
  search: string
): Promise<BookClubDoc[]> => {
  // Ensure that the user is authenticated
  await ensureAuth();

  // Fetch the user's book clubs
  return await findBookClubsBySearch(search);
};
