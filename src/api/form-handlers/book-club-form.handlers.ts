'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { Publicity, Role } from '@/db/models/book-club.models';
import {
  addBookClub,
  findByName
} from '@/db/repositories/book-club.repository';
import { updateUser } from '@/db/repositories/user.repository';
import { ErrorFormState } from '@/api/form-handlers/state-interfaces';
import { ensureAuth } from '@/api/auth.api';
import props from '@/util/properties';

/**
 * Handle submitting a new book club
 *
 * @param {ErrorFormState} prevState Form state from the previous render
 * @param {FormData} formData The book club form's data, matching the Book Club interface
 * @return {ErrorFormState} The new form state; Used for passing back error messages
 */
export const handleSubmitNewBookClub = async (
  prevState: ErrorFormState,
  formData: FormData
): Promise<ErrorFormState> => {
  // Get the user and ensure that they're authenticated
  await ensureAuth();

  // Pull out the user
  const user = await ensureAuth();

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
    Publicity.PRIVATE;
  if (!(publicity in Publicity)) publicity = Publicity.PRIVATE;

  // Create the new club
  const newClubResult = await addBookClub({
    name,
    description:
      formData.get('description')?.toString().trim() ||
      'A book club for reading books',
    image: formData.get('image')?.toString() ?? '',
    publicity: publicity as Publicity,
    members: [
      {
        userID: user._id,
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
        clubID: newClubResult.insertedId,
        joined: new Date(),
        role: Role.OWNER
      }
    ]
  });

  // On success, redirect to the home page
  revalidatePath('/home');
  redirect('/home');
};
