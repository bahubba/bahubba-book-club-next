'use server';

import { ensureAuth } from '@/api/auth.api';
import {
  findBookClubs,
  findBookClubsBySearch,
  findBookClub,
  findBookClubRole,
  findBookClubPublicity,
  findBookClubMembers,
  findBookClubName
} from '@/db/repositories/book-club.repository';
import { BookClubProperties, Publicity } from '@/db/models/nodes';
import { BookClubMembership, Role } from '@/db/models/relationships';

/**
 * Retrieve all book clubs for the logged-in user
 *
 * @return {Promise<BookClubProperties[]>} The user's book clubs
 */
export const getBookClubs = async (): Promise<BookClubProperties[]> => {
  // Ensure that the user is authenticated
  const { email } = await ensureAuth();

  // Fetch and return the user's book clubs
  return await findBookClubs(email);
};

/**
 * Retrieve a book club by slug
 *
 * @param {string} slug The slug of the book club to retrieve
 * @return {Promise<BookClubProperties | null>} The book club with the given slug, or null if it doesn't exist
 */
export const getBookClub = async (
  slug: string
): Promise<BookClubProperties | null> => {
  // Ensure that the user is authenticated
  const { email } = await ensureAuth();

  // Fetch the book club
  const bookClub = await findBookClub(slug, email);

  // Return the book club
  return bookClub;
};

/**
 * Search for book clubs by name or description
 *
 * @param {string} search The search term to find book clubs by
 * @return {Promise<BookClubProperties[]>}
 */
export const searchForBookClubs = async (
  search: string
): Promise<BookClubProperties[]> => {
  // Ensure that the user is authenticated
  const { email } = await ensureAuth();

  // Fetch and return the user's book clubs
  return await findBookClubsBySearch(email, search);
};

/**
 * Retrieve a user's role in a book club
 *
 * @param {string} slug The slug of the book club
 * @return {Promise<Role | null>} The user's role in the book club, or null if they are not a member
 */
export const getBookClubRole = async (slug: string): Promise<Role | null> => {
  // Ensure that the user is authenticated
  const { email } = await ensureAuth();

  // Fetch the user's role in the book club and return
  return await findBookClubRole(slug, email);
};

/**
 * Get a book club's publicity
 *
 * @param {string} slug The slug of the book club
 * @return {Promise<Publicity | null>} The publicity of the book club
 */
export const getBookClubPublicity = async (
  slug: string
): Promise<Publicity | null> => {
  // Ensure that the user is authenticated
  await ensureAuth();

  // Fetch and return the book club's publicity
  return await findBookClubPublicity(slug);
};

/**
 * Get a book club's members
 *
 * @param {string} slug The slug of the book club
 * @return {Promise<BookClubMembership[]>} The members of the book club
 */
export const getBookClubMembers = async (
  slug: string
): Promise<BookClubMembership[]> => {
  // Ensure that the user is authenticated
  const { email } = await ensureAuth();

  // Fetch the user's membership in the club and ensure they're an admin or owner
  const role = await findBookClubRole(slug, email);
  if (!role || ![Role.ADMIN, Role.OWNER].includes(role)) {
    // TODO - Handle this error more gracefully
    throw new Error('You are not authorized to perform this action');
  }

  // Fetch the book club and return its members
  return await findBookClubMembers(slug);
};

/**
 * Gets a book club's name
 *
 * @param {string} slug The slug of the book club
 * @return {Promise<string | null>} The name of the book club
 */
export const getBookClubName = async (slug: string): Promise<string | null> => {
  // Ensure that the user is authenticated and pull the user's email
  const { email } = await ensureAuth();

  // Fetch the book club and return its name
  return await findBookClubName(slug, email);
};
