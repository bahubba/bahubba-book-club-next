'use server';

import { getServerSession } from 'next-auth';

import { findUser } from '@/db/repositories/user.repository';
import { UserProperties } from '@/db/models/nodes';

/** Ensure authentication */
export const ensureAuth = async (): Promise<UserProperties> => {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error('Not authenticated');

  // Pull the user from Neo4j
  const user = await findUser(session.user.email);
  if (!user || !user.email) throw new Error('No user found');

  return user;
};
