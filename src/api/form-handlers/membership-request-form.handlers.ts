'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { ensureAuth } from '../auth.api';
import {
  requestMembership,
  reviewMembershipRequest
} from '@/db/repositories/membership-request.repository';
import {
  addMember,
  checkMembership,
  findBookClubRole,
  reinstateMember
} from '@/db/repositories/membership.repository';
import { MembershipRequestStatus, Role } from '@/db/models/nodes';
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
  // Ensure the user is authenticated and pull out their email
  const { email } = await ensureAuth();

  // Pull out the slug and ensure it exists
  const slug = formData.get('slug')?.toString().trim();
  if (!slug) return { error: 'Invalid book club' };

  // Request membership in the book club
  await requestMembership(slug, email, {
    status: MembershipRequestStatus.PENDING,
    requested: new Date().toISOString(),
    requestMessage:
      formData.get('requestMessage')?.toString().trim() ??
      'Please allow me to join your book club!'
  });

  // Redirect to the book club page
  // TODO - toast
  redirect(`/book-club/${slug}`);
};

/**
 * Handle approving or rejecting a membership request
 *
 * @param {ErrorFormState} _ Form state from the previous render; Unused
 * @param {FormData} formData Data from the form: slug, userEmail, and status
 * @return {ErrorFormState} The new form state; Used for passing back error messages
 */
export const handleReviewMembershipRequest = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Ensure the user is authenticated and pull out their email
  const { email: adminEmail } = await ensureAuth();

  // Pull out the book club slug and ensure it is not empty
  const slug = formData.get('slug')?.toString().trim();
  if (!slug) return { error: 'Invalid book club' };

  // Pull out the user's email and ensure it is not empty
  const userEmail = formData.get('userEmail')?.toString().trim();
  if (!userEmail) return { error: 'Invalid user' };

  // Pull out the status and ensure it is approving or rejecting
  const status = formData.get('status')?.toString().trim();
  if (
    !status ||
    ![
      MembershipRequestStatus.APPROVED,
      MembershipRequestStatus.REJECTED
    ].includes(status as MembershipRequestStatus)
  )
    return { error: 'Invalid status' };

  // Ensure the requesting user is an admin or owner of the book club
  const adminRole = await findBookClubRole(slug, adminEmail);
  if (!adminRole || ![Role.OWNER, Role.ADMIN].includes(adminRole))
    return { error: 'Unauthorized' };

  // Approve or reject the membership request
  await reviewMembershipRequest(
    slug,
    userEmail,
    adminEmail,
    status as MembershipRequestStatus,
    '' // TODO - Allow admins to leave a message
  );

  // If the approving the request, add  or reinstate the user as a member
  if (status === MembershipRequestStatus.APPROVED) {
    // Check to see if the user is a departed member
    const departed = await checkMembership(slug, userEmail, false);

    // If the user is a departed member, reinstate them
    if (departed) await reinstateMember(slug, userEmail, adminEmail);
    else
      await addMember(slug, userEmail, adminEmail, {
        role: Role.READER,
        joined: new Date().toISOString(),
        isActive: true
      });
  }

  // Return no error
  revalidatePath(`/book-club/${slug}/admin`);
  return { error: '' };
};
