import connectMongo from "@/db/connect-mongo";
import User from "@/db/models/user.model";
import { UserDoc } from "@/db/interfaces";

/**
 * @param {UserDoc} user - The user to add to the database
 */
export default async function addTest(user: UserDoc) {
  try {
    console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log('CONNECTED TO MONGO');

    console.log('CREATING DOCUMENT');
    const test = await User.create(user);
    console.log('CREATED DOCUMENT');

  } catch (error) {
    console.log(error);
  }
}