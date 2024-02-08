'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

import { ensureAuth } from '@/api/auth.api';
import {
  addBookClub,
  bookClubExists,
  findBookClubForAdmin,
  updateBookClub
} from '@/db/repositories/book-club.repository';
import { updateMemberRole } from '@/db/repositories/membership.repository';
import { ErrorFormState } from '@/api/form-handlers/state-interfaces';
import { Publicity } from '@/db/models/nodes';
import { Role } from '@/db/models/relationships';
import props from '@/util/properties';

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
  const slug = slugify(name, { lower: true });

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
  const slug = slugify(name, { lower: true });
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

  // On success, redirect to the home page
  revalidatePath('/home');
  redirect(`/book-club/${slug}/admin/details`);
};
