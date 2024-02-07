'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';

import {
  Publicity as MongoPublicity,
  Publicity,
  Role
} from '@/db/models/book-club.models';
import {
  addBookClub,
  addMongoBookClub,
  bookClubExists,
  findBookClubBySlugForAdmin,
  findByName,
  findMongoMemberRoleBySlug,
  updateBookClub
} from '@/db/repositories/book-club.repository';
import { updateUser } from '@/db/repositories/user.repository';
import { ErrorFormState } from '@/api/form-handlers/state-interfaces';
import { ensureAuth, ensureMongoAuth } from '@/api/auth.api';
import props from '@/util/properties';
import { updateMemberRole } from '@/db/repositories/membership.repository';

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
 * Handle submitting a new book club
 *
 * @param {ErrorFormState} _ Form state from the previous render; Unused
 * @param {FormData} formData The book club form's data, matching the Book Club interface
 * @return {ErrorFormState} The new form state; Used for passing back error messages
 */
export const handleCreateMongoBookClub = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Get the user and ensure that they're authenticated
  const user = await ensureMongoAuth();

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
    MongoPublicity.PRIVATE;
  if (!(publicity in MongoPublicity)) publicity = MongoPublicity.PRIVATE;

  // Create a slug for the book club from the name
  const slug = slugify(name, { lower: true });

  // Create the new club
  await addMongoBookClub({
    name,
    slug,
    description:
      formData.get('description')?.toString().trim() ||
      'A book club for reading books',
    image: formData.get('image')?.toString() ?? '',
    publicity: publicity as MongoPublicity,
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
 * @param {ErrorFormState} _ Form state from the previous render
 * @param {FormData} formData The book club form's data, matching the Book Club interface
 * @return {ErrorFormState} The new form state; Used for passing back error messages
 */
export const handleUpdateBookClub = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Get the user and ensure that they're authenticated
  const user = await ensureMongoAuth();

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
    MongoPublicity.PRIVATE;
  if (!(publicity in MongoPublicity)) publicity = existing.publicity;

  // Create a book club doc out of the form data
  const updated = {
    name,
    slug,
    description:
      formData.get('description')?.toString().trim() ||
      (props.APP.DEFAULT_CLUB_DESCRIPTION as string),
    image: formData.get('image')?.toString() || '',
    publicity: publicity as MongoPublicity
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

/**
 * Handle updating a member's role in a book club
 *
 * @param {ErrorFormState} _ Form state from the previous render
 * @param {FormData} formData The form data, containing the club slug, the member's email, and the new role
 * @return {ErrorFormState} The new form state; Used for passing back error messages
 */
export const handleUpdateMemberRole = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Ensure the user is authenticated and pull out their email
  const { email: adminEmail } = await ensureMongoAuth();

  // Pull out the form data
  const slug = formData.get('slug')?.toString().trim() || '';
  const memberEmail = formData.get('email')?.toString().trim() || '';
  const newRole = formData.get('role')?.toString().trim().toUpperCase() || '';

  // Ensure all form fields are present and valid
  if (slug === '' || memberEmail === '' || newRole === '' || !(newRole in Role))
    return { error: 'Incomplete form data' };

  // Ensure the user is not trying to change their own role
  if (formData.get('email')?.toString() === adminEmail)
    return { error: 'Cannot change own role' };

  // Ensure the requesting user is an admin (or owner) of the club and they aren't an admin trying to change ownership of the club
  const adminRole = await findMongoMemberRoleBySlug(slug, adminEmail);
  if (
    !adminRole ||
    ![Role.ADMIN, Role.OWNER].includes(adminRole) ||
    (adminRole !== Role.OWNER && newRole === Role.OWNER)
  )
    return { error: 'Unauthorized' };

  // Ensure the member exists in the club and they are getting a new role
  const existingRole = await findMongoMemberRoleBySlug(slug, memberEmail);
  if (!existingRole || existingRole === newRole || existingRole === Role.OWNER)
    return { error: 'Invalid role change' };

  // Update the member's role
  await updateMemberRole(slug, memberEmail, newRole as Role);

  // If the new role is OWNER, demote the requesting user to admin
  if (newRole === Role.OWNER)
    await updateMemberRole(slug, adminEmail, Role.ADMIN);

  // On success, revalidate the admin page
  revalidatePath(`/book-club/${slug}/admin`);
  return { error: '' };
};
