'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

import { Publicity, Role } from '@/db/models/book-club.models';
import {
  addBookClub,
  findBookClubBySlugForAdmin,
  findByName,
  updateBookClub
} from '@/db/repositories/book-club.repository';
import { updateUser } from '@/db/repositories/user.repository';
import { ErrorFormState } from '@/api/form-handlers/state-interfaces';
import { ensureAuth } from '@/api/auth.api';
import props from '@/util/properties';

/**
 * Handle submitting a new book club
 *
 * @param {ErrorFormState} _ Form state from the previous render; Unused
 * @param {FormData} formData The book club form's data, matching the Book Club interface
 * @return {ErrorFormState} The new form state; Used for passing back error messages
 */
export const handleSubmitNewBookClub = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Get the user and ensure that they're authenticated
  const user = await ensureAuth();

  // Pull out the club's name and ensure that it is not a reserved word
  const name = formData.get('name')?.toString().trim() ?? '';
  if (props.APP.RESERVED_CLUB_NAMES.includes(name))
    return { error: 'Invalid name' };

  // Ensure there isn't an existing book club with the same name
  const existing = await findByName(name);
  if (existing) return { error: 'Name already in use' };

  // Ensure publicity is a valid value
  let publicity =
    formData.get('publicity')?.toString().trim().toUpperCase() ||
    Publicity.PRIVATE;
  if (!(publicity in Publicity)) publicity = Publicity.PRIVATE;

  // Create a slug for the book club from the name
  const slug = slugify(name, { lower: true });

  // Create the new club
  await addBookClub({
    name,
    slug,
    description:
      formData.get('description')?.toString().trim() ||
      'A book club for reading books',
    image: formData.get('image')?.toString() ?? '',
    publicity: publicity as Publicity,
    members: [
      {
        userEmail: user.email,
        joined: new Date(),
        role: Role.OWNER
      }
    ]
  });

  // Add membership in the club to the user
  await updateUser({
    ...user,
    memberships: [
      ...user.memberships,
      {
        clubSlug: slug,
        joined: new Date(),
        role: Role.OWNER
      }
    ]
  });

  // On success, redirect to the home page
  revalidatePath('/home');
  redirect('/home');
};

/**
 * Handle updating a book club
 *
 * @param {ErrorFormState} prevState Form state from the previous render
 * @param {FormData} formData The book club form's data, matching the Book Club interface
 * @return {ErrorFormState} The new form state; Used for passing back error messages
 */
export const handleUpdateBookClub = async (
  prevState: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Get the user and ensure that they're authenticated
  const user = await ensureAuth();

  // Ensure all form fields are present and valid
  if (
    !formData.get('previousSlug') ||
    !formData.get('description') ||
    !formData.get('image') ||
    !formData.get('publicity')
  )
    return { error: 'Incomplete form data' };

  // Pull out the club's name and ensure that it is not a reserved word
  const name = formData.get('name')?.toString().trim() ?? '';
  if (
    !name ||
    props.APP.RESERVED_CLUB_NAMES.includes(name) ||
    name.includes('/')
  )
    return { error: 'Invalid name' };

  // Slugify the name
  const slug = slugify(formData.get('name')?.toString().trim() || '', {
    lower: true
  });

  // Get the existing club, ensuring it exists and the user is an admin
  const existing = await findBookClubBySlugForAdmin(
    formData.get('previousSlug')?.toString() || '',
    user.email
  );
  if (!existing || !existing.slug) return { error: 'Book club not found' };

  // Ensure publicity is a valid value
  let publicity =
    formData.get('publicity')?.toString().trim().toUpperCase() ||
    Publicity.PRIVATE;
  if (!(publicity in Publicity)) publicity = existing.publicity;

  // Create a book club doc out of the form data
  const updated = {
    name,
    slug,
    description:
      formData.get('description')?.toString().trim() ||
      (props.APP.DEFAULT_CLUB_DESCRIPTION as string),
    image: formData.get('image')?.toString() || '',
    publicity: publicity as Publicity
  };

  // Ensure there are actual changes
  if (JSON.stringify(updated) === JSON.stringify(existing))
    return { error: 'No changes' };

  // Update the club
  await updateBookClub(existing.slug, updated);

  // On success, redirect to the home page
  revalidatePath('/home');
  redirect(`/book-club/${slug}/admin/details`);
};
