import { connectCollection } from '@/db/connect-mongo';
import { BookClubDoc, Role } from '@/db/models/book-club.models';
import {
  BookClubMembershipRequest,
  BookClubMembershipRequestStatus
} from '@/db/models/membership-request.models';
import props from '@/util/properties';
import { UpdateResult } from 'mongodb';

/**
 * Request membership in a book club
 *
 * @param {string} slug The slug of the book club to request membership in
 * @param {string} userEmail The email of the user requesting membership
 * @param {string} message The message to send with the request
 * @return {Promise<UpdateResult<BookClubDoc>>}
 */
export const requestMembership = async (
  slug: string,
  userEmail: string,
  message: string
): Promise<UpdateResult<BookClubDoc>> => {
  // Connect to the database and collection
  const collection = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Update the book club in the database
  return await collection.updateOne(
    {
      slug,
      disbanded: { $exists: false },
      membershipRequests: {
        $not: {
          $elemMatch: {
            userEmail,
            status: BookClubMembershipRequestStatus.PENDING
          }
        }
      }
    },
    {
      $push: {
        membershipRequests: {
          userEmail,
          message,
          requested: new Date(),
          status: BookClubMembershipRequestStatus.PENDING
        }
      }
    }
  );
};

/**
 * Approve or reject a membership request
 *
 * @param {string} slug The slug of the book club to approve or reject the request for
 * @param {string} userEmail The email of the user requesting membership
 * @param {BookClubMembershipRequestStatus} status The status to set the request to
 * @return {Promise<UpdateResult<BookClubDoc>>}
 */
export const reviewMembershipRequest = async (
  slug: string,
  userEmail: string,
  status: BookClubMembershipRequestStatus
): Promise<UpdateResult<BookClubDoc>> => {
  // Connect to the database and collection
  const collection = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Update the book club in the database
  return await collection.updateOne(
    {
      slug,
      disbanded: { $exists: false },
      'membershipRequests.userEmail': userEmail
    },
    {
      $set: {
        'membershipRequests.$.status': status
      }
    }
  );
};

/**
 * Check if a user has an open membership request for a given book club
 *
 * @param {string} slug The slug of the book club
 * @param {string} userEmail The email of the user
 * @return {Promise<boolean>} Whether the user has an open membership request
 */
export const hasOpenRequest = async (
  slug: string,
  userEmail: string
): Promise<boolean> => {
  // Connect to the database and collection
  const collection = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Find the book club in the database
  const count = await collection.countDocuments({
    slug,
    disbanded: { $exists: false },
    membershipRequests: {
      $elemMatch: {
        userEmail,
        status: BookClubMembershipRequestStatus.PENDING
      }
    }
  });

  // Return whether there is an open request
  return count > 0;
};

// TODO - Paginate
/**
 * Get the membership requests for a book club
 *
 * @param {string} slug The slug of the book club
 * @param {string} userEmail The email of the requesting user
 * @return {Promise<BookClubMembershipRequest[]>} The membership requests
 */
export const findMembershipRequests = async (
  slug: string,
  userEmail: string
): Promise<BookClubMembershipRequest[]> => {
  // Connect to the database and collection
  const collection = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Find the book club in the database
  const result = await collection.findOne(
    {
      slug,
      disbanded: { $exists: false },
      members: {
        $elemMatch: {
          userEmail,
          $or: [{ role: Role.OWNER }, { role: Role.ADMIN }]
        }
      }
    },
    {
      projection: {
        membershipRequests: 1
      }
    }
  );

  // Return the membership requests
  return result.membershipRequests ?? [];
};
