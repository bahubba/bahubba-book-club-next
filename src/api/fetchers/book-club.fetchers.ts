'use server';

import { BookClubDoc } from '@/db/models/book-club.models';
import {
  findBookClubsBySearch,
  findBookClubsForUser,
  findBookClubByName,
  findBookClubBySlug
} from '@/db/repositories/book-club.repository';
import { ensureAuth } from '@/api/auth.api';

/** Retrieves all book clubs for the logged-in user */
export const getBookClubsForUser = async (): Promise<BookClubDoc[]> => {
  // Ensure that the user is authenticated
  const user = await ensureAuth();

  // Fetch the user's book clubs
  return await findBookClubsForUser(user._id);
};

/**
 * Searches for book clubs by name or description
 *
 * @param {string} search The search term to find book clubs by
 */
export const searchBookClubs = async (
  search: string
): Promise<BookClubDoc[]> => {
  // Ensure that the user is authenticated
  await ensureAuth();

  // Fetch the user's book clubs
  return await findBookClubsBySearch(search);
};

/**
 * Gets a book club by name
 *
 * @param {string} name The name of the book club to find
 */
export const getBookClubByName = async (
  name: string
): Promise<BookClubDoc | null> => {
  // Ensure that the user is authenticated
  const user = await ensureAuth();

  // Fetch the book club
  return await findBookClubByName(name, user._id);
};

/**
 * Gets a book club by slug
 *
 * @param {string} slug The slug of the book club to find
 */
export const getBookClubBySlug = async (
  slug: string
): Promise<BookClubDoc | null> => {
  // Ensure that the user is authenticated
  const user = await ensureAuth();

  // Fetch the book club
  return await findBookClubBySlug(slug, user._id);
};
