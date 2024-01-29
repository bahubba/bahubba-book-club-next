'use server';

import { getServerSession } from 'next-auth';

import { VerifiedUserDoc } from '@/db/models/user.models';
import { findUserByEmail } from '@/db/repositories/user.repository';

/** Ensure authentication */
export const ensureAuth = async (): Promise<VerifiedUserDoc> => {
  // TODO - Handle exceptions
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error('Not authorized');

  // Pull the user from MongoDB
  const user = await findUserByEmail(session.user.email);
  if (!user || !user._id) throw new Error('Not authorized');

  return user as VerifiedUserDoc;
};
