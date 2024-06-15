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

  // Create the discussion
  await createAdHocDiscussion(bookClubSlug, email, {
    id: uuidv4(),
    title,
    description,
    isActive: true,
    created: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  });

  // On success, revalidate the book club home page and redirect to it
  // TODO - go to the book club's discussion page
  revalidatePath(`/book-club/${bookClubSlug}`);
  redirect(`/book-club/${bookClubSlug}`);
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
  const nodeID = formData.get('nodeID')?.toString().trim() || '';
  const content = formData.get('content')?.toString().trim() || '';

  console.log(
    'bookClubSlug, email, nodeID, content',
    bookClubSlug,
    email,
    nodeID,
    content
  ); // DELETEME

  // Ensure the slug is not empty
  if (!bookClubSlug || !nodeID || !content)
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

  // On success, revalidate the book club home page and redirect to it
  // TODO - go to the book club's discussion page
  revalidatePath(`/book-club/${bookClubSlug}`);
  redirect(`/book-club/${bookClubSlug}`);
};
