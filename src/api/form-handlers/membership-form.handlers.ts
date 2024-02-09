'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import {
  addMember,
  removeMember,
  updateMemberRole
} from '@/db/repositories/membership.repository';
import { ErrorFormState } from './state-interfaces';
import { ensureAuth } from '../auth.api';
import { findBookClubRole } from '@/db/repositories/membership.repository';
import { Role } from '@/db/models/nodes';

/**
 * Handle adding a member to a book club
 *
 * @param {ErrorFormState} _ Form state from the previous render
 * @param {FormData} formData The form data, containing the club slug and member email
 * @return {ErrorFormState} The new form state; Used for passing back error messages
 */
export const handleAddMember = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Ensure the user is authenticated and pull out their email
  const { email: adminEmail } = await ensureAuth();

  // Pull out the form data
  const slug = formData.get('slug')?.toString().trim() || '';
  const memberEmail = formData.get('userEmail')?.toString().trim() || '';

  // Ensure all form fields are present and valid
  if (slug === '' || memberEmail === '')
    return { error: 'Incomplete form data' };

  // Ensure the requesting user is an admin (or owner) of the club
  const adminRole = await findBookClubRole(slug, adminEmail);
  if (!adminRole || ![Role.ADMIN, Role.OWNER].includes(adminRole))
    return { error: 'Unauthorized' };

  // Add the member to the club
  await addMember(slug, memberEmail, adminEmail, {
    role: Role.READER,
    joined: new Date().toISOString(),
    isActive: true
  });

  // On success, revalidate the admin page
  revalidatePath(`/book-club/${slug}/admin`);
  return { error: '' };
};

/**
 * Handle updating a member's role in a book club
 *
 * @param {ErrorFormState} _ Form state from the previous render
 * @param {FormData} formData The form data, containing the club slug, member email, and new role
 */
export const handleUpdateMemberRole = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Ensure the user is authenticated and pull out their email
  const { email: adminEmail } = await ensureAuth();

  // Pull out the form data
  const slug = formData.get('slug')?.toString().trim() || '';
  const memberEmail = formData.get('userEmail')?.toString().trim() || '';
  const newRole = formData.get('role')?.toString().trim().toUpperCase() || '';

  // Ensure all form fields are present and valid
  if (slug === '' || memberEmail === '' || newRole === '')
    return { error: 'Incomplete form data' };

  // Ensure the user is not trying to change their own role
  if (memberEmail === adminEmail) return { error: 'Cannot change own role' };

  // Ensure the requesting user is an admin (or owner) of the club
  const adminRole = await findBookClubRole(slug, adminEmail);
  if (
    !adminRole ||
    ![Role.ADMIN, Role.OWNER].includes(adminRole) ||
    (adminRole !== Role.OWNER && newRole === Role.OWNER)
  )
    return { error: 'Unauthorized' };

  // Ensure the member exists in the club and they are getting a new role
  const existingRole = await findBookClubRole(slug, memberEmail);
  if (!existingRole || existingRole === newRole || existingRole === Role.OWNER)
    return { error: 'Invalid role change' };

  // Update the member's role
  await updateMemberRole(slug, memberEmail, adminEmail, newRole as Role);

  // If the new role is OWNER, demote the requesting user to admin
  if (newRole === Role.OWNER)
    await updateMemberRole(slug, adminEmail, adminEmail, Role.ADMIN);

  // On success, revalidate the admin page
  revalidatePath(`/book-club/${slug}/admin`);
  return { error: '' };
};

/**
 * Handle removing a member from a book club
 *
 * @param {ErrorFormState} _ Form state from the previous render
 * @param {FormData} formData The form data, containing the club slug and member email
 * @return {ErrorFormState} The new form state; Used for passing back error messages
 */
export const handleRemoveMember = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Ensure the user is authenticated and pull out their email
  const { email: adminEmail } = await ensureAuth();

  // Pull out the form data
  const slug = formData.get('slug')?.toString().trim() || '';
  const memberEmail = formData.get('userEmail')?.toString().trim() || '';

  // Ensure all form fields are present and valid
  if (slug === '' || memberEmail === '')
    return { error: 'Incomplete form data' };

  // Ensure the requesting user is an admin (or owner) of the club and they are not an owner removing themselves
  const adminRole = await findBookClubRole(slug, adminEmail);
  if (
    !adminRole ||
    ![Role.ADMIN, Role.OWNER].includes(adminRole) ||
    (adminRole === Role.OWNER && adminEmail === memberEmail)
  )
    return { error: 'Unauthorized' };

  // Remove the member from the club
  await removeMember(slug, memberEmail, adminEmail);

  // If the user removed themselves, redirect to the home page
  if (adminEmail === memberEmail) {
    revalidatePath('/home');
    redirect('/home');
  }

  // On success, revalidate the admin page
  revalidatePath(`/book-club/${slug}/admin`);
  return { error: '' };
};
