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
      'membershipRequests.userEmail': { $ne: userEmail }
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
