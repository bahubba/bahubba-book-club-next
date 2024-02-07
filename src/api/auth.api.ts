'use server';

import { getServerSession } from 'next-auth';

import {
  findFullUserByEmail,
  findUser
} from '@/db/repositories/user.repository';
import { UserDoc } from '@/db/models/user.models';
import { UserProperties } from '@/db/models/nodes';

/** Ensure authentication */
export const ensureAuth = async (): Promise<UserProperties> => {
  const session = await getServerSession();
  console.log('session', session); // DELETEME
  if (!session?.user?.email) throw new Error('Not authorized');

  // Pull the user from Neo4j
  const user = await findUser(session.user.email);
  console.log('user', user); // DELETEME
  if (!user || !user.email) throw new Error('Not authorized');

  return user;
};

/** Ensure authentication */
export const ensureMongoAuth = async (): Promise<UserDoc> => {
  // TODO - Handle exceptions
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error('Not authorized');

  // Pull the user from MongoDB
  const user = await findFullUserByEmail(session.user.email);
  if (!user || !user.email) throw new Error('Not authorized');

  return user;
};
