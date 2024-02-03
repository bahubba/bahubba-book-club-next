import { Collection } from 'mongodb';

import { UserDoc } from '@/db/models/user.models';
import { connectCollection } from '@/db/connect-mongo';
import props from '@/util/properties';

/**
 * Adds a user document to MongoDB
 *
 * @param {UserDoc} user The user document to add
 */
export const addUser = async (user: UserDoc) => {
  // Connect to the database and collection
  const collection: Collection<UserDoc> = await connectCollection(
    props.DB.ATLAS_USER_COLLECTION
  );

  // Add the user to the database
  return collection.insertOne(user);
};

/**
 * Updates a user document in MongoDB
 *
 * @param {UserDoc} user The user document to update
 */
export const updateUser = async (user: UserDoc) => {
  // Connect to the database and collection
  const collection: Collection<UserDoc> = await connectCollection(
    props.DB.ATLAS_USER_COLLECTION
  );

  // TODO - Throw error if user._id is undefined
  // Update the user in the database
  return collection.updateOne({ email: user.email }, { $set: user });
};

/**
 * Finds a user document by email
 *
 * @param {string} email The email address to search for
 * @return {UserDoc | null} The user document if found, null otherwise
 */
export const findUserByEmail = async (
  email: string
): Promise<UserDoc | null> => {
  // Connect to the database and collection
  const collection: Collection<UserDoc> = await connectCollection(
    props.DB.ATLAS_USER_COLLECTION
  );

  // Find the user in the database
  return collection.findOne({ email });
};
