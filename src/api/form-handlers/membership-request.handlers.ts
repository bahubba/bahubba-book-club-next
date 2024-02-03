'use server';

import { redirect } from 'next/navigation';

import { ensureAuth } from '@/api/auth.api';
import { requestMembership } from '@/db/repositories/membership-request.repository';
import { ErrorFormState } from './state-interfaces';

/**
 * Handle submitting a membership request
 *
 * @param {ErrorFormState} _ Form state from the previous render; Unused
 * @param {FormData} formData The membership request form's data, matching the MembershipRequest interface
 * @return {ErrorFormState} The new form state; Used for passing back error messages
 */
export const handleSubmitMembershipRequest = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Get the user and ensure that they're authenticated
  const user = await ensureAuth();

  // Pull out the slug and ensure it exists
  const slug = formData.get('slug')?.toString().trim();
  if (!slug) return { error: 'Invalid book club' };

  // Request membership in the book club
  await requestMembership(slug, user.email);

  // Redirect to the book club page
  // TODO - toast
  redirect(`/book-club/${slug}`);
};
