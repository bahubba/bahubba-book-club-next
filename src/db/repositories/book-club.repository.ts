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
  return await collection.insertOne(bookClub);
};

/**
 * Updates a book club
 *
 * @param {string} slug The slug of the book club to update
 * @param {BookClubDoc} bookClub The book club to update
 */
export const updateBookClub = async (slug: string, bookClub: BookClubDoc) => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Update the book club in the database
  return await collection.updateOne({ slug }, { $set: bookClub });
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
  return await collection.findOne(
    { name },
    { collation: { locale: 'en', strength: 2 } }
  );
};

/**
 * Find all book clubs for which a user is a member
 *
 * @param {string} userEmail The email of the user to search for
 * @return {Promise<BookClubDoc[]>} The book clubs for which the user is a member
 */
export const findBookClubsForUser = async (
  userEmail: string
): Promise<BookClubDoc[]> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Find the book clubs in the database
  return await collection
    .find({
      members: {
        $elemMatch: {
          userEmail: userEmail,
          departed: { $exists: false }
        }
      }
    })
    .toArray();
};

/**
 * Find all public book clubs that match a search term
 *
 * @param {string} query The search term to match
 * @param {string} userEmail The email of the searching user
 * @return {Promise<BookClubDoc[]>} The book clubs that match the search term
 */
export const findBookClubsBySearch = async (
  query: string,
  userEmail: string
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
            {
              $and: [
                { publicity: Publicity.PRIVATE },
                {
                  members: {
                    $elemMatch: {
                      userEmail: userEmail,
                      departed: { $exists: false }
                    }
                  }
                }
              ]
            }
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
 * @param {string} userEmail The email of the user to search for
 * @return {Promise<BookClubDoc | null>} The book club if found, null otherwise
 */
export const findBookClubByName = async (
  name: string,
  userEmail: string
): Promise<BookClubDoc | null> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Find the book club in the database
  return await collection.findOne({
    departed: { $exists: false },
    name,
    $or: [
      { publicity: Publicity.PUBLIC },
      {
        members: {
          $elemMatch: {
            userEmail: userEmail,
            departed: { $exists: false }
          }
        }
      }
    ]
  });
};

/**
 * Find a book club by its slug
 *
 * @param {string} slug The slug of the book club to find
 * @param {string} userEmail The email of the user to search for
 * @return {Promise<BookClubDoc | null>} The book club if found, null otherwise
 */
export const findBookClubBySlug = async (
  slug: string,
  userEmail: string
): Promise<BookClubDoc | null> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Find the book club in the database
  return await collection.findOne({
    departed: { $exists: false },
    slug,
    $or: [
      { publicity: Publicity.PUBLIC },
      {
        members: {
          $elemMatch: {
            userEmail: userEmail,
            departed: { $exists: false }
          }
        }
      }
    ]
  });
};

/**
 * Find a user's membership in a book club by slug
 *
 * @param {string} slug The slug of the book club
 * @param {string} userEmail The email of the user to search for
 * @return {Promise<Role | null>} The user's role in the book club, or null if they are not a member
 */
export const findMemberRoleBySlug = async (
  slug: string,
  userEmail: string
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
        'members.userEmail': userEmail,
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
        localField: 'members.userEmail',
        foreignField: 'email',
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

  // Run the aggregation to get the members and return
  return await collection
    .aggregate<BookClubMemberProjection>(aggregation)
    .toArray();
};

/**
 * Finds a book club by its slug where the requesting user is an admin (or owner)
 *
 * @param {string} slug The slug of the book club to find
 * @param {string} userEmail The email of the requesting user
 */
export const findBookClubBySlugForAdmin = async (
  slug: string,
  userEmail: string
): Promise<BookClubDoc | null> => {
  // Connect to the database and collection
  const collection: Collection<BookClubDoc> = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Find the book club in the database
  return await collection.findOne({
    slug,
    members: {
      $elemMatch: {
        userEmail: userEmail,
        role: { $in: [Role.OWNER, Role.ADMIN] },
        departed: { $exists: false }
      }
    }
  });
};
