import connectMongo from '@/db/connect-mongo';
import UserModel from '@/db/models/user.model';
import { User } from '@/db/interfaces';
import { model } from 'mongoose';

/**
 * Adds a user document to MongoDB
 *
 * @param {User} user - The user to add to the database
 */
export const addUser = async (user: User) => {
  try {
    // Connect to MongoDB Atlas
    await connectMongo();

    // Convert the user object to a document (mongoose model)
    const userDoc = new UserModel(user);

    // Persist a user document to MongoDB
    await userDoc.save();

    // TODO - Return something... The persisted version of the user?
  } catch (error) {
    console.log(error);
  }
};

/**
 * Finds a user document in MongoDB by email
 *
 * @param {string} email - The email address of the user to find
 * @return {User} The user document found in MongoDB
 */
export const findUserByEmail = async (email: string): Promise<User | null | undefined> => {
  try {
    // Establish connection to MongoDB Atlas
    await connectMongo();

    // Find the user document in MongoDB
    return await UserModel.findOne({ email });
  } catch (error) {
    console.log(error);
  }
};

