'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

import { ensureAuth } from '@/api/auth.api';
import {
  addBookClub,
  bookClubExists,
  findBookClubForAdmin,
  findBookClubsBySearch,
  updateBookClub
} from '@/db/repositories/book-club.repository';
import { ErrorFormState, SearchFormState } from '@/api/form-handlers/state-interfaces';
import { Publicity, Role } from '@/db/models/nodes';
import props from '@/util/properties';
import { findBookClubRole } from '@/db/repositories/membership.repository';
import { advancePicker } from '@/db/repositories/pick.repository';

/**
 * Handle submitting a new book club
 *
 * @param {ErrorFormState} _ Form state from the previous render; Unused
 * @param {FormData} formData The book club form's data, matching the Book Club interface
 * @return {Promise<ErrorFormState>} The new form state; Used for passing back error messages
 */
export const handleCreateBookClub = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Get the user and ensure that they're authenticated
  const { email } = await ensureAuth();

  // Pull out the form data
  const name = formData.get('name')?.toString().trim() ?? '';
  const description =
    formData.get('description')?.toString().trim() ||
    'A book club for reading books';
  const image = formData.get('image')?.toString() ?? '';
  let publicity =
    (formData.get('publicity')?.toString().trim().toUpperCase() as Publicity) ??
    Publicity.PRIVATE;

  // Slugify the name
  const slug = slugify(name, {
    lower: true,
    remove: /[*+~.()'"!:@#$%^&\\/;:{}||`<>?,.-]/g
  });

  // Ensure the slug is not empty or a reserved word
  if (props.APP.RESERVED_CLUB_NAMES.includes(slug))
    return { error: 'Invalid name' };

  // Ensure there isn't an existing book club with the same slug
  const existing = await bookClubExists(slug);
  if (existing) return { error: 'Name already in use' };

  // Ensure publicity is a valid value; default to PRIVATE if not
  if (!(publicity in Publicity)) publicity = Publicity.PRIVATE;

  // Create the new book club (with the user as the owner)
  // TODO - Error handling
  try {
    await addBookClub(
      email,
      {
        name,
        slug,
        description,
        image,
        publicity,
        isActive: true,
        created: new Date().toISOString()
      },
      { role: Role.OWNER, joined: new Date().toISOString(), isActive: true }
    );
  } catch (e) {
    console.log('error adding book club', e);
    return { error: 'Failed to create book club' };
  }

  // On success, redirect to the home page
  revalidatePath('/home');
  redirect('/home');
};

/**
 * Handle updating a book club
 *
 * @param {ErrorFormState} _ Form state from the previous render
 * @param {FormData} formData The book club form's data, matching the Book Club interface
 * @return {ErrorFormState} The new form state; Used for passing back error messages
 */
export const handleUpdateBookClub = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Get the user and ensure that they're authenticated
  const { email } = await ensureAuth();

  // Pull out the form data and ensure it's valid
  const previousSlug = formData.get('previousSlug')?.toString().trim() || '';
  const name = formData.get('name')?.toString().trim() ?? '';
  const slug = slugify(name, {
    lower: true,
    remove: /[*+~.()'"!:@#$%^&\\/;:{}||`<>?,.-]/g
  });
  const description =
    formData.get('description')?.toString().trim() ||
    'A book club for reading books';
  const image = formData.get('image')?.toString() || 'default.jpg';
  let publicity =
    (formData.get('publicity')?.toString().trim().toUpperCase() as Publicity) ??
    Publicity.PRIVATE;
  if (!slug || props.APP.RESERVED_CLUB_NAMES.includes(slug))
    return { error: 'Invalid name' };

  // Get the existing club, ensuring it exists and the user is an admin
  const existing = await findBookClubForAdmin(previousSlug, email);
  if (!existing) return { error: 'Book club not found' };

  // Update the club node
  await updateBookClub(previousSlug, email, {
    name,
    slug,
    description,
    image,
    publicity,
    isActive: true,
    created: existing.created
  });

  // On success, return no error
  revalidatePath('/book-club/[slug]/admin/details');
  return { error: '' };
};

/**
 * Search for book clubs by name or description
 *
 * @param {SearchFormState} _ Form state from the previous render; Unused
 * @param {FormData} formData The search form's data, containing the search term
 * @return {Promise<SearchFormState>} The new form state; Used for passing back search results or error messages
 */
export const handleBookClubSearch = async (
  _: SearchFormState,
  formData: FormData
): Promise<SearchFormState> => {
  // Get the user and ensure that they're authenticated
  const { email } = await ensureAuth();

  // Pull out the search term
  const search = formData.get('search')?.toString().trim() || '';

  // Ensure the search term is not empty
  if (!search) return { error: 'Invalid search term', bookClubs: [] };

  // Fetch and return the book clubs
  return { error: '', bookClubs: await findBookClubsBySearch(email, search) };
};

/**
 * Handle advancing the current picker of the book club
 *
 * @param {ErrorFormState} _ Form state from the previous render; Unused
 * @param {FormData} formData The form data, containing the book club slug
 * @return {Promise<ErrorFormState>} The new form state; Used for passing back error messages
 */
export const handleAdvancePicker = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Get the user and ensure that they're authenticated
  const { email } = await ensureAuth();

  // Pull out the form data
  const slug = formData.get('slug')?.toString().trim() || '';
  const pageRoute = formData.get('pageRoute')?.toString().trim() || '';

  // Ensure the slug is not empty
  if (!slug || !pageRoute) return { error: 'Invalid form data' };

  // Get the user's role in the book club
  const role = await findBookClubRole(slug, email);
  if (!role || ![Role.ADMIN, Role.OWNER].includes(role))
    return { error: 'Unauthorized' };

  // Advance the picker
  await advancePicker(slug, email);

  // Revalidate the path and redirect back to it to refresh
  revalidatePath(pageRoute);
  redirect(pageRoute);
};

/**
 * Handle picking a book
 *
 * @param {ErrorFormState} _ From state from the previous render; Unused
 * @param {FormData} formData The form data, containing the book to be picked
 * @return {Promise<ErrorFormState>} The new form state; Used for passing back error messages
 */
export const handlePickBook = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Get the user and ensure that they're authenticated
  const { email } = await ensureAuth();


}
