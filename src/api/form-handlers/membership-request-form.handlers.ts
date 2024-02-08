'use server';

import { redirect } from 'next/navigation';

import { ensureMongoAuth } from '@/api/auth.api';
import {
  requestMongoMembership,
  reviewMongoMembershipRequest
} from '@/db/repositories/membership-request.repository';
import { ErrorFormState } from './state-interfaces';
import { BookClubMembershipRequestStatus } from '@/db/models/membership-request.models';
import { Role } from '@/db/models/relationships';
import {
  addMongoMember,
  checkMongoMembership,
  reinstatemMongoMembership
} from '@/db/repositories/membership.repository';
import { revalidatePath } from 'next/cache';

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
  const { email } = await ensureMongoAuth();

  // Pull out the slug and ensure it exists
  const slug = formData.get('slug')?.toString().trim();
  if (!slug) return { error: 'Invalid book club' };

  // Request membership in the book club
  await requestMongoMembership(
    slug,
    email,
    formData.get('requestMessage')?.toString().trim() ?? ''
  );

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
  const { email: adminEmail } = await ensureMongoAuth();

  // Pull out the form data and ensure it's valid
  const slug = formData.get('slug')?.toString().trim();
  if (!slug) return { error: 'Invalid book club' };

  const userEmail = formData.get('userEmail')?.toString().trim();
  if (!userEmail) return { error: 'Invalid user' };

  const status = formData.get('status')?.toString().trim();
  if (
    !status ||
    ![
      BookClubMembershipRequestStatus.APPROVED,
      BookClubMembershipRequestStatus.REJECTED
    ].includes(status as BookClubMembershipRequestStatus)
  )
    return { error: 'Invalid status' };

  // Ensure the requesting user is an admin or owner of the book club
  const adminRole = await findMongoMemberRoleBySlug(slug, adminEmail);
  if (!adminRole || ![Role.OWNER, Role.ADMIN].includes(adminRole))
    return { error: 'Unauthorized' };

  // Approve or reject the membership request
  await reviewMongoMembershipRequest(
    slug,
    userEmail,
    status as BookClubMembershipRequestStatus
  );

  // If the approving the request, add  or reinstate the user as a member
  if (status === BookClubMembershipRequestStatus.APPROVED) {
    // Check to see if the user is a departed member
    const departed = await checkMongoMembership(slug, userEmail, true);

    // If the user is a departed member, reinstate them
    if (departed) await reinstatemMongoMembership(slug, userEmail);
    else await addMongoMember(slug, userEmail);
  }

  // Return no error
  revalidatePath(`/book-club/${slug}/admin`);
  return { error: '' };
};
