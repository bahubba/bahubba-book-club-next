import { Collection, InsertOneResult } from 'mongodb';
import {
  BookClubDoc,
  BookClubMemberProjection,
  Publicity,
  Role
} from '@/db/models/book-club.models';
import { connectCollection } from '@/db/connect-mongo';
import props from '@/util/properties';

/**
 * Adds a book club to MongoDB
 *
 * @param {BookClubDoc} bookClub The book club to add
 * @return {Promise<InsertOneResult<BookClubDoc>>} The result of the insert operation
 */
export const addBookClub = async (
  bookClub: BookClubDoc
): Promise<InsertOneResult<BookClubDoc>> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

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
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Find the book club in the database
  return collection.findOne(
    { name },
    { collation: { locale: 'en', strength: 2 } }
  );
};

/**
 * Find all book clubs for which a user is a member
 *
 * @param {string} userID The ID of the user to search for
 * @return {Promise<BookClubDoc[]>} The book clubs for which the user is a member
 */
export const findBookClubsForUser = async (
  userID: string
): Promise<BookClubDoc[]> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Find the book clubs in the database
  return await collection
    .find({ 'members.userID': userID, 'members.departed': { $exists: false } })
    .toArray();
};

/**
 * Find all public or observable book clubs that match a search term
 *
 * @param {string} query The search term to match
 * @return {Promise<BookClubDoc[]>} The book clubs that match the search term
 */
export const findBookClubsBySearch = async (
  query: string
): Promise<BookClubDoc[]> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Find the book clubs in the database
  return await collection
    .find({
      $and: [
        {
          disbanded: { $exists: false }
        },
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ]
        },
        {
          $or: [
            { publicity: Publicity.PUBLIC },
            { publicity: Publicity.OBSERVABLE },
            { publicity: Publicity.PRIVATE }
          ]
        }
      ]
    })
    .toArray();
};

/**
 * Find a book club by its name
 *
 * @param {string} name The name of the book club to find
 * @param {string} userID The ID of the user to search for
 * @return {Promise<BookClubDoc | null>} The book club if found, null otherwise
 */
export const findBookClubByName = async (
  name: string,
  userID: string
): Promise<BookClubDoc | null> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  console.log('name, userID', name, userID);

  // Find the book club in the database
  return await collection.findOne({
    departed: { $exists: false },
    name,
    'members.userID': userID,
    'members.departed': { $exists: false }
  });
};

/**
 * Find a book club by its slug
 *
 * @param {string} slug The slug of the book club to find
 * @param {string} userID The ID of the user to search for
 * @return {Promise<BookClubDoc | null>} The book club if found, null otherwise
 */
export const findBookClubBySlug = async (
  slug: string,
  userID: string
): Promise<BookClubDoc | null> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  console.log('name, userID', slug, userID);

  // Find the book club in the database
  return await collection.findOne({
    departed: { $exists: false },
    slug,
    'members.userID': userID,
    'members.departed': { $exists: false }
  });
};

/**
 * Find a user's membership in a book club by slug
 *
 * @param {string} slug The slug of the book club
 * @param {string} userID The ID of the user to search for
 * @return {Promise<Role | null>} The user's role in the book club, or null if they are not a member
 */
export const findMemberRoleBySlug = async (
  slug: string,
  userID: string
): Promise<Role | null> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Create an aggregation pipeline to find the user's role in the book club
  const aggregation = [
    {
      $unwind: {
        path: '$members'
      }
    },
    {
      $match: {
        slug,
        'members.userID': userID,
        'members.departed': {
          $exists: false
        }
      }
    },
    {
      $project: {
        role: '$members.role'
      }
    }
  ];

  // Find the user's role in the book club
  const result = await collection.aggregate(aggregation).toArray();
  return result.length > 0 ? result[0].role : null;
};

/**
 * Find a book club's members by its slug
 *
 * @param {string} slug The slug of the book club to find
 * @return {Promise<BookClubMemberProjection[]>} The members of the book club
 */
export const findMembersBySlug = async (
  slug: string
): Promise<BookClubMemberProjection[]> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Generate the aggregation pipeline
  const aggregation = [
    {
      $match: {
        slug,
        disbanded: {
          $exists: false
        }
      }
    },
    {
      $unwind: {
        path: '$members'
      }
    },
    {
      $match: {
        'members.departed': {
          $exists: false
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'members.userID',
        foreignField: '_id',
        as: 'memberDetails'
      }
    },
    {
      $project: {
        preferredName: {
          $arrayElemAt: ['$memberDetails.preferredName', 0]
        },
        email: {
          $arrayElemAt: ['$memberDetails.email', 0]
        },
        role: '$members.role',
        joined: {
          $arrayElemAt: ['$memberDetails.joined', 0]
        }
      }
    }
  ];

  return [
    {
      preferredName: 'test',
      email: 'test',
      role: Role.ADMIN,
      joined: new Date()
    }
  ];

  // Run the aggregation to get the members and return
  return await collection
    .aggregate<BookClubMemberProjection>(aggregation)
    .toArray();
};
