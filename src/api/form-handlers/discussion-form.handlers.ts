'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

import { ensureAuth } from '@/api/auth.api';
import { ErrorFormState } from './state-interfaces';
import {
  createAdHocDiscussion,
  replyToDiscussion
} from '@/db/repositories/discussion.repository';
import { findBookClubRole } from '@/db/repositories/membership.repository';

/**
 * Handle creating an ad-hoc discussion
 *
 * @param {ErrorFormState} _ Form state from the previous render; Unused
 * @param {FormData} formData The form data, containing the book club slug
 * @return {Promise<ErrorFormState>} The new form state; Used for passing back error messages
 */
export const handleCreateAdHocDiscussion = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Get the user and ensure that they're authenticated
  const { email } = await ensureAuth();

  // Pull out the form data
  const bookClubSlug = formData.get('slug')?.toString().trim() || '';
  const title = formData.get('title')?.toString().trim() || '';
  const description = formData.get('description')?.toString().trim() || '';

  // Ensure the slug is not empty
  if (!bookClubSlug || !title || !description)
    return { error: 'Invalid form data' };

  // Ensure the user is a member of the book club
  const role = await findBookClubRole(bookClubSlug, email);
  if (!role) return { error: 'Unauthorized' };

  // Create an ID for the discussion
  const id = uuidv4();

  // Create the discussion
  await createAdHocDiscussion(bookClubSlug, email, {
    id,
    title,
    description,
    isActive: true,
    created: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  });

  // On success, navigate to the new discussion page
  redirect(`/book-club/${bookClubSlug}/discussions/${id}`);
};

/**
 * Handle creating a reply to a discussion or another reply
 *
 * @param {ErrorFormState} _ Form state from the previous render; Unused
 * @param {FormData} formData The form data, containing the book club slug, node ID, and reply text
 * @return {Promise<ErrorFormState>} The new form state; Used for passing back error messages
 */
export const handleReplyToDiscussion = async (
  _: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Get the user and ensure that they're authenticated
  const { email } = await ensureAuth();

  // Pull out the form data
  const bookClubSlug = formData.get('slug')?.toString().trim() || '';
  const discussionID = formData.get('discussionID')?.toString().trim() || '';
  const nodeID = formData.get('nodeID')?.toString().trim() || '';
  const content = formData.get('content')?.toString().trim() || '';

  // Ensure the slug is not empty
  // TODO - Move error messages/statuses into an enum for easier maintenance
  if (!bookClubSlug || !discussionID || !nodeID || !content)
    return { error: 'Invalid form data' };

  // Ensure the user is a member of the book club
  const role = await findBookClubRole(bookClubSlug, email);
  if (!role) return { error: 'Unauthorized' };

  // Create the reply
  await replyToDiscussion(bookClubSlug, email, nodeID, {
    id: uuidv4(),
    content,
    isActive: true,
    created: new Date().toISOString()
  });

  // On success, revalidate the discussion page and return a success status
  revalidatePath(`/book-club/${bookClubSlug}/discussions/${discussionID}`);
  return { error: '', succeeded: true };
};
