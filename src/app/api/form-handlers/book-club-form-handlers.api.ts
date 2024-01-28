import { getServerSession } from 'next-auth';

import { BookClubDoc, Publicity, Role } from '@/db/models/book-club.models';
import { addBookClub, findByName } from '@/db/repositories/book-club.repository';
import { findUserByEmail, updateUser } from '@/db/repositories/user.repository';
import props from '@/util/properties';

/**
 * Handle submitting a new book club
 *
 * @param {BookClubDoc} _ Unused; The previous form state
 * @param {FormData} formData The book club form's data, matching the Book Club interface
 */
export const handleSubmitNewBookClub = async (_: BookClubDoc, formData: FormData) => {
  // Get the user and ensure that they're authenticated
  const session = await getServerSession();

  // TODO - Handle exceptions
  if(!session?.user?.email) throw new Error('Not authorized');

  // Pull out the club's name and ensure that it is not a reserved word
  const name = formData.get('name')?.toString() ?? '';
  if (props.APP.RESERVED_CLUB_NAMES.includes(name)) throw new Error('Invalid name');

  // Ensure there isn't an existing book club with the same name
  const existing = await findByName(formData.get('name')?.toString() ?? '');
  if(existing) throw new Error('Duplicate name');

  // Pull the user from MongoDB
  const user = await findUserByEmail(session.user.email);
  if(!user || !user._id) throw new Error('User not found');

  // Ensure publicity is a valid value
  let publicity = formData.get('publicity')?.toString().trim().toUpperCase() || Publicity.PRIVATE;
  if (!(publicity in Publicity)) publicity = Publicity.PRIVATE;

  // Create the new club
  const newClubResult = await addBookClub({
    name,
    description: formData.get('description')?.toString() ?? 'A book club for reading books',
    image: formData.get('image')?.toString() ?? '',
    publicity: publicity as Publicity,
    members: [{
      userID: user._id,
      joined: new Date(),
      role: Role.OWNER
    }]
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
}