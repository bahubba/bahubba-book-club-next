'use server';

import { getServerSession } from 'next-auth';

import {
  findFullUserByEmail,
  findUser
} from '@/db/repositories/user.repository';
import { UserDoc } from '@/db/models/user.models';
import { UserNode } from '@/db/nodes/user.nodes';

/** Ensure authentication */
export const ensureAuth = async (): Promise<UserNode> => {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error('Not authorized');

  // Pull the user from Neo4j
  const user = await findUser(session.user.email);
  if (!user || !user.properties.email) throw new Error('Not authorized');

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
