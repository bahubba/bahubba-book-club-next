import { UpdateResult } from 'mongodb';
import { connectCollection } from '../connect-mongo';

import { BookClubDoc, Role } from '../models/book-club.models';
import props from '@/util/properties';

// Interface for updates to both the book club and user collections
export interface MembershipUpdate {
  bcUpdate: UpdateResult<BookClubDoc>;
  uUpdate: UpdateResult<BookClubDoc>;
}

/**
 * Check a user's [previous] membership in a book club
 *
 * @param {string} slug The club's slug
 * @param {string} userEmail The user's email
 * @param {boolean} departed Whether to check for a departed membership
 * @return {Promise<boolean>}
 */
export const checkMembership = async (
  slug: string,
  userEmail: string,
  departed = false
): Promise<boolean> => {
  // Connect to the database and collection
  const collection = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Check the user's membership
  const count = await collection.countDocuments({
    slug,
    disbanded: { $exists: false },
    members: {
      $elemMatch: {
        userEmail,
        departed: { $exists: departed }
      }
    }
  });

  return count > 0;
};

/**
 * Update a member's role in a club
 * ADMIN/OWNER REPO FUNCTION
 *
 * @param {string} slug The club's slug
 * @param {string} userEmail The member's email
 * @param {Role} newRole The member's new role
 */
export const updateMemberRole = async (
  slug: string,
  userEmail: string,
  newRole: Role
): Promise<MembershipUpdate> => {
  // Connect to the database and collection
  const bcCollection = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Update the book club in the database
  const bcUpdate = await bcCollection.updateOne(
    {
      slug,
      disbanded: { $exists: false },
      members: {
        $elemMatch: {
          userEmail,
          role: { $ne: newRole },
          departed: { $exists: false }
        }
      }
    },
    {
      $set: {
        'members.$.role': newRole
      }
    }
  );

  // Connect to the user collection
  const uCollection = await connectCollection(props.DB.ATLAS_USER_COLLECTION);

  // Update the user's memberships
  const uUpdate = await uCollection.updateOne(
    {
      email: userEmail,
      departed: { $exists: false },
      memberships: {
        $elemMatch: {
          slug,
          departed: { $exists: false },
          role: { $ne: newRole }
        }
      }
    },
    {
      $set: {
        'memberships.$.role': newRole
      }
    }
  );

  return { bcUpdate, uUpdate };
};

/**
 * Add a member to a book club
 * ADMIN/OWNER REPO FUNCTION
 *
 * @param {string} slug The club's slug
 * @param {string} userEmail The new member's email
 * @return {Promise<MembershipUpdate>}
 */
export const addMember = async (
  slug: string,
  userEmail: string
): Promise<MembershipUpdate> => {
  // Connect to the book club collection
  const bcCollection = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Add the member to the book club
  const bcUpdate = await bcCollection.updateOne(
    {
      slug,
      disbanded: { $exists: false },
      members: {
        $not: {
          $elemMatch: {
            userEmail
          }
        }
      }
    },
    {
      $push: {
        members: {
          userEmail,
          joined: new Date(),
          role: Role.READER
        }
      }
    }
  );

  // Connect to the user collection
  const uCollection = await connectCollection(props.DB.ATLAS_USER_COLLECTION);

  // Add the club to the user's memberships
  const uUpdate = await uCollection.updateOne(
    {
      email: userEmail,
      departed: { $exists: false },
      memberships: {
        $not: {
          $elemMatch: {
            clubSlug: slug
          }
        }
      }
    },
    {
      $push: {
        memberships: {
          clubSlug: slug,
          joined: new Date(),
          role: Role.READER
        }
      }
    }
  );

  return { bcUpdate, uUpdate };
};

/**
 * Reinstate a user's membership in a club
 * ADMIN/OWNER REPO FUNCTION
 *
 * @param {string} slug The club's slug
 * @param {string} userEmail The user's email
 * @return {Promise<MembershipUpdate>}
 */
export const reinstateMembership = async (
  slug: string,
  userEmail: string
): Promise<MembershipUpdate> => {
  // Connect to the book club collection
  const bcCollection = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Reinstate the user's membership
  const bcUpdate = await bcCollection.updateOne(
    {
      slug,
      disbanded: { $exists: false },
      members: {
        $elemMatch: {
          userEmail,
          departed: { $exists: true }
        }
      }
    },
    {
      $set: {
        'members.$.role': Role.READER
      },
      $unset: {
        'members.$.departed': 1
      }
    }
  );

  // Connect to the user collection
  const uCollection = await connectCollection(props.DB.ATLAS_USER_COLLECTION);

  // Reinstate the user's membership
  const uUpdate = await uCollection.updateOne(
    {
      email: userEmail,
      departed: { $exists: false },
      memberships: {
        $elemMatch: {
          clubSlug: slug,
          departed: { $exists: true }
        }
      }
    },
    {
      $set: {
        'memberships.$.role': Role.READER
      },
      $unset: {
        'memberships.$.departed': 1
      }
    }
  );

  return { bcUpdate, uUpdate };
};

/**
 * Remove a member from a book club
 * ADMIN/OWNER REPO FUNCTION (or self)
 *
 * @param {string} slug The club's slug
 * @param {string} userEmail The member's email
 * @return {Promise<MembershipUpdate>}
 */
export const removeMember = async (
  slug: string,
  userEmail: string
): Promise<MembershipUpdate> => {
  // Connect to the book club collection
  const bcCollection = await connectCollection(
    props.DB.ATLAS_BOOK_CLUB_COLLECTION
  );

  // Remove the member from the book club
  const bcUpdate = await bcCollection.updateOne(
    {
      slug,
      disbanded: { $exists: false },
      members: {
        $elemMatch: {
          userEmail,
          departed: { $exists: false }
        }
      }
    },
    {
      $set: {
        'members.$.departed': new Date()
      }
    }
  );

  // Connect to the user collection
  const uCollection = await connectCollection(props.DB.ATLAS_USER_COLLECTION);

  // Remove the club from the user's memberships
  const uUpdate = await uCollection.updateOne(
    {
      email: userEmail,
      departed: { $exists: false },
      memberships: {
        $elemMatch: {
          clubSlug: slug,
          departed: { $exists: false }
        }
      }
    },
    {
      $set: {
        'memberships.$.departed': new Date()
      }
    }
  );

  return { bcUpdate, uUpdate };
};
