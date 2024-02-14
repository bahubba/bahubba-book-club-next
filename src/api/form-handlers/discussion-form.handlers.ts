'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { ensureAuth } from '@/api/auth.api';
import { ErrorFormState } from './state-interfaces';
import {
  createAdHocDiscussion,
  discussionExists
} from '@/db/repositories/discussion.repository';
import { findBookClubRole } from '@/db/repositories/membership.repository';
import slugify from 'slugify';
import props from '@/util/properties';

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

  // Slugify the title and ensure it doesn't include a reserved word
  const discussionSlug = slugify(title, {
    lower: true,
    remove: /[*+~.()'"!:@#$%^&\\/;:{}||`<>?,.-]/g
  });
  if (props.APP.RESERVED_DISCUSSION_NAMES.includes(discussionSlug))
    return { error: 'Invalid discussion title' };

  // Ensure the slug is unique within the book club
  const duplicate = await discussionExists(bookClubSlug, discussionSlug);
  if (duplicate) return { error: 'Discussion already exists' };

  // Ensure the user is a member of the book club
  const role = await findBookClubRole(bookClubSlug, email);
  if (!role) return { error: 'Unauthorized' };

  // Create the discussion
  await createAdHocDiscussion(bookClubSlug, email, {
    title,
    slug: discussionSlug,
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
