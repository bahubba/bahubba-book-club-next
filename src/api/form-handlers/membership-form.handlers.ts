'use server';

import { revalidatePath } from 'next/cache';

import { ensureAuth } from '../auth.api';
import { findMemberRoleBySlug } from '@/db/repositories/book-club.repository';
import { removeMember } from '@/db/repositories/membership.repository';
import { Role } from '@/db/models/book-club.models';
import { ErrorFormState } from './state-interfaces';

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

  // Ensure the requesting user is an admin (or owner) of the club
  const adminRole = await findMemberRoleBySlug(slug, adminEmail);
  if (!adminRole || ![Role.ADMIN, Role.OWNER].includes(adminRole))
    return { error: 'Unauthorized' };

  // Ensure the member exists in the club and they're not an owner and they're not an admin removing another admin
  const memberRole = await findMemberRoleBySlug(slug, memberEmail);
  if (
    !memberRole ||
    memberRole === Role.OWNER ||
    (memberRole === Role.ADMIN && adminEmail !== memberEmail)
  )
    return { error: 'Invalid member' };

  // Remove the member
  await removeMember(slug, memberEmail);

  // On success, revalidate the admin page
  revalidatePath(`/book-club/${slug}/admin`);
  return { error: '' };
};
