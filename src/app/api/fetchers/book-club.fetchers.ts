import { getServerSession } from 'next-auth';

import { BookClubDoc } from '@/db/models/book-club.models';
import { findUserByEmail } from '@/db/repositories/user.repository';
import { findBookClubsForUser } from '@/db/repositories/book-club.repository';

/** Retrieves all book clubs for the logged-in user */
export const getBookClubsForUser = async (): Promise<BookClubDoc[]> => {
  // Get the user and ensure that they're authenticated
  const session = await getServerSession();

  // TODO - Handle exceptions
  if (!session?.user?.email) throw new Error('Not authenticated');

  // Pull the user from MongoDB and ensure that they haven't canceled their membership
  const user = await findUserByEmail(session.user.email);
  if (!user || !user._id || user.departed) throw new Error('User not found');

  // Fetch the user's book clubs
  return findBookClubsForUser(user._id);
};