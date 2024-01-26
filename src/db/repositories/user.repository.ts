import connectMongo from '@/db/connect-mongo';
import User from '@/db/models/user.model';
import { UserDoc } from '@/db/interfaces';

/**
 * Adds a user document to MongoDB
 * @param {UserDoc} user - The user to add to the database
 */
export default async function addTest(user: UserDoc) {
  try {
    // Connect to MongoDB Atlas
    await connectMongo();

    // Persist a user document to MongoDB
    const userDoc = await User.create(user);

    // TODO - Return something... The persisted version of the user?
  } catch (error) {
    console.log(error);
  }
}