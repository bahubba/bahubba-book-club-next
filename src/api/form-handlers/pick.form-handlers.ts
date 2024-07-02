'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { addPick } from '@/db/repositories/pick.repository';
import { ensureAuth } from '@/api/auth.api';
import { addBook, bookExists } from '@/db/repositories/book.repository';
import { ErrorFormState } from '@/api/form-handlers/state-interfaces';

/**
 * Handle picking a book for a club
 *
 * @param {ErrorFormState} _ Form state from the previous render; Unused
 * @param {FormData} formData The form data, containing the book club slug and the ID of book being selected
 * @return {Promise<ErrorFormState>} The new form state; Used for passing back error messages
 */
export const handlePickBook = async (_: ErrorFormState, formData: FormData): Promise<ErrorFormState> => {
  // Get the user's email and ensure they're authenticated
  const { email } = await ensureAuth();

  // Pull out the form data
  const bookClubSlug = formData.get('bookClubSlug')?.toString().trim() || '';
  const googleBooksID = formData.get('bookID')?.toString().trim() || '';

  // Ensure no data is missing
  if(!bookClubSlug || !googleBooksID) return { error: 'Invalid form data' };

  // If we don't have an internal node for the book, it needs to be created
  if(!await bookExists(googleBooksID)) {
    // TODO - Check for missing authors and add them

    await addBook({
      googleBooksID,
      title: formData.get('title')?.toString().trim() ?? 'Unknown Title',
      authors: formData.get('authors')?.toString().split(',') ?? ['Unknown Author'],
      description: formData.get('description')?.toString().trim(),
      thumbnail: formData.get('thumbnail')?.toString().trim(),
      // TODO - Identifies need to be nodes since they're complex types
      // identifiers:
      //   formData.get('identifiers')?.toString().split(',').map(id => {
      //     const idParts = id.split(':');
      //     return { type: idParts[0], identifier: idParts[1]};
      //   }),
      isActive: true
    });
  }

  // Create the pick
  const successfulPick = await addPick(
    bookClubSlug,
    email,
    googleBooksID,
    {
      pickedOn: new Date().toDateString(),
      isActive: true
    }
  );

  // If a pick wasn't created, return an error
  if(!successfulPick) return { error: 'Unable to submit pick' };

  // On success navigate back to the book club home page
  revalidatePath(`/book-club/${bookClubSlug}`);
  redirect(`/book-club/${bookClubSlug}`);
}