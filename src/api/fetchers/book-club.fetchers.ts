'use server';

import { ensureAuth } from '@/api/auth.api';
import { BookClubDoc, Role } from '@/db/models/book-club.models';
import {
  findBookClubsBySearch,
  findBookClubsForUser,
  findBookClubByName,
  findBookClubBySlug,
  findMemberRoleBySlug,
  findMembersBySlug,
  findPublicityBySlug,
  findNameBySlug
} from '@/db/repositories/book-club.repository';
import {
  BookClubMemberProjection,
  Publicity
} from '@/db/models/book-club.models';

/** Retrieves all book clubs for the logged-in user */
export const getBookClubsForUser = async (): Promise<BookClubDoc[]> => {
  // Ensure that the user is authenticated
  const user = await ensureAuth();

  console.log('user email', user.email); // DELETEME

  // Fetch and return the user's book clubs
  return await findBookClubsForUser(user.email);
};

/**
 * Searches for book clubs by name or description
 *
 * @param {string} search The search term to find book clubs by
 * @return {Promise<BookClubDoc[]>} The book clubs that match the search term
 */
export const searchBookClubs = async (
  search: string
): Promise<BookClubDoc[]> => {
  // Ensure that the user is authenticated
  const { email } = await ensureAuth();

  // Fetch and return the user's book clubs
  return await findBookClubsBySearch(search, email);
};

/**
 * Gets a book club by name
 *
 * @param {string} name The name of the book club to find
 * @return {Promise<BookClubDoc | null>} The book club with the given name, or null if it doesn't exist
 */
export const getBookClubByName = async (
  name: string
): Promise<BookClubDoc | null> => {
  // Ensure that the user is authenticated
  const user = await ensureAuth();

  // Fetch the book club
  const bookClub = await findBookClubByName(name, user.email);

  // Return the book club
  return !!bookClub ? bookClub : null;
};

/**
 * Gets a book club by slug
 *
 * @param {string} slug The slug of the book club to find
 * @return {Promise<BookClubDoc | null>} The book club with the given slug, or null if it doesn't exist
 */
export const getBookClubBySlug = async (
  slug: string
): Promise<BookClubDoc | null> => {
  // Ensure that the user is authenticated
  const user = await ensureAuth();

  // Fetch the book club
  const bookClub = await findBookClubBySlug(slug, user.email);

  // Return the book club
  return !!bookClub ? bookClub : null;
};

/**
 * Gets a user's membership in a book club by slug
 *
 * @param {string} slug The slug of the book club
 * @return {Promise<Role | null>} The user's role in the book club, or null if they are not a member
 */
export const getBookClubRole = async (slug: string): Promise<Role | null> => {
  // Ensure that the user is authenticated
  const user = await ensureAuth();

  // Fetch the user's role in the book club and return
  return await findMemberRoleBySlug(slug, user.email);
};

/**
 * Gets a book club's publicity
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
  return await findPublicityBySlug(slug);
};

/**
 * Gets a book club's members by slug
 * @param {string} slug The slug of the book club
 * @return {Promise<BookClubMemberProjection[]>} The members of the book club
 */
export const getMembersBySlug = async (
  slug: string
): Promise<BookClubMemberProjection[]> => {
  // Ensure that the user is authenticated
  const user = await ensureAuth();

  // Ensure the user is an admin or owner of the book club
  const role = await findMemberRoleBySlug(slug, user.email);
  if (!role || ![Role.ADMIN, Role.OWNER].includes(role)) {
    // TODO - Handle this error more gracefully
    throw new Error('You are not authorized to perform this action');
  }

  // Fetch the book club and return its members
  return await findMembersBySlug(slug);
};

/**
 * Checks whether a user is a member of a book club
 *
 * @param {string} slug The slug of the book club
 * @return {Promise<boolean>} Whether the user is a member of the book club
 */
export const isBookClubMember = async (slug: string): Promise<boolean> => {
  // Ensure that the user is authenticated
  const { email } = await ensureAuth();

  // Fetch the user's role in the book club
  const role = await findMemberRoleBySlug(slug, email);

  // Return whether the user is a member
  return !!role;
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
  return await findNameBySlug(slug, email);
};
