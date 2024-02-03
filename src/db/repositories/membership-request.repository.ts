import { connectCollection } from '../connect-mongo';
import { BookClubMembershipRequestStatus } from '../models/book-club.models';
import props from '../../util/properties';

/**
 * Request membership in a book club
 *
 * @param {string} slug The slug of the book club to request membership in
 * @param {string} userEmail The email of the user requesting membership
 */
export const requestMembership = async (slug: string, userEmail: string) => {
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
 */
export const reviewMembershipRequest = async (
  slug: string,
  userEmail: string,
  status: BookClubMembershipRequestStatus
) => {
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
export const hasOpenRequest = async (slug: string, userEmail: string) => {
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
