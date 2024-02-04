'use server';

import { getServerSession } from 'next-auth';

import { findFullUserByEmail } from '@/db/repositories/user.repository';
import { UserDoc } from '@/db/models/user.models';

/** Ensure authentication */
export const ensureAuth = async (): Promise<UserDoc> => {
  // TODO - Handle exceptions
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error('Not authorized');

  // Pull the user from MongoDB
  const user = await findFullUserByEmail(session.user.email);
  if (!user || !user.email) throw new Error('Not authorized');

  return user;
};
