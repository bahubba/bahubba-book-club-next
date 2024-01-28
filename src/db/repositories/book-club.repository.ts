import { Collection, InsertOneResult } from 'mongodb';
import { BookClubDoc } from '@/db/models/book-club.models';
import { connectCollection } from '@/db/connect-mongo';
import props from '@/util/properties';

/**
 * Adds a book club to MongoDB
 *
 * @param {BookClubDoc} bookClub The book club to add
 * @return {Promise<InsertOneResult<BookClubDoc>>} The result of the insert operation
 */
export const addBookClub = async (bookClub: BookClubDoc): Promise<InsertOneResult<BookClubDoc>> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(props.DB.ATLAS_BOOK_CLUB_COLLECTION);

  // Add the book club to the database
  return collection.insertOne(bookClub);
};

/**
 * Finds a book club by its name
 *
 * @param {string} name The name of the book club to find
 * @return {Promise<BookClubDoc | null>} The book club if found, null otherwise
 */
export const findByName = async (name: string): Promise<BookClubDoc | null> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(props.DB.ATLAS_BOOK_CLUB_COLLECTION);

  // Find the book club in the database
  return collection.findOne({ name });
};

/**
 * Find all book clubs for which a user is a member
 *
 * @param {string} userID The ID of the user to search for
 */
export const findBookClubsForUser = async (userID: string): Promise<BookClubDoc[]> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(props.DB.ATLAS_BOOK_CLUB_COLLECTION);

  // Find the book clubs in the database
  return collection.find({ 'members.userID': userID, 'members.departed': { $exists: false } }).toArray();
};