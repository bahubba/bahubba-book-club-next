import { driver } from '../connect-neo4j';
import {
  MembershipRequestProperties,
  MembershipRequestStatus,
  UserAndMembershipRequest,
  UserProperties
} from '../models/nodes';

/**
 * Request membership in a book club
 *
 * @param {string} slug The slug of the book club to request membership in
 * @param {string} email The email of the user requesting membership
 * @param {MembershipRequestProperties} membershipRequest The properties for the membership request
 * @return {Promise<void>}
 */
export const requestMembership = async (
  slug: string,
  email: string,
  membershipRequest: MembershipRequestProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Add the membership request
  await session.run(
    `
    MATCH (u:User { email: $email, isActive: TRUE })
    MATCH (b:BookClub { slug: $slug, isActive: TRUE })
    MERGE (mr:MembershipRequest {
      status: $membershipRequest.status,
      requested: $membershipRequest.requested,
      requestMessage: $membershipRequest.requestMessage
    })
    MERGE (u)-[:REQUESTED_MEMBERSHIP]->(mr)<-[:HAS_MEMBERSHIP_REQUEST]-(b)
    `,
    { slug, email, membershipRequest }
  );

  // Close the session
  session.close();
};

/**
 * Approve or reject a membership request
 *
 * @param {string} slug The slug of the book club to approve or reject the request for
 * @param {string} userEmail The email of the user requesting membership
 * @param {string} adminEmail The email of the admin approving or rejecting the request
 * @param {string} status The status to set the request to
 * @param {string} reviewMessage The approval or rejection message
 * @return {Promise<void>}
 */
export const reviewMembershipRequesta = async (
  slug: string,
  userEmail: string,
  adminEmail: string,
  status: MembershipRequestStatus,
  reviewMessage: string
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Approve or reject the membership request
  await session.run(
    `
    MATCH (:User { email: $userEmail, isActive: TRUE })-[:REQUESTED_MEMBERSHIP]->(mr:MembershipRequest { status: 'PENDING' })<-[:HAS_MEMBERSHIP_REQUEST]-(b:BookClub { slug: $slug, isActive: TRUE })<-[ar:IS_MEMBER_OF]-(a:User { email: $adminEmail, isActive: TRUE })
    WHERE ar.role IN ['ADMIN', 'OWNER']
    SET mr.status = $status, mr.reviewed = date(), mr.reviewMessage = $reviewMessage
    MERGE (a)-[:REVIEWED_MEMBERSHIP_REQUEST]->(mr)
    `,
    { slug, userEmail, adminEmail, status, reviewMessage }
  );

  // Close the session
  session.close();
};

/**
 * Check if a user has an open membership request for a given book club
 *
 * @param {string} slug The slug of the book club
 * @param {string} email The email of the user
 * @return {Promise<boolean>} Whether the user has an open membership request
 */
export const hasOpenRequest = async (
  slug: string,
  email: string
): Promise<boolean> => {
  // Connect to Neo4j
  const session = driver.session();

  // Check if the user has an open membership request
  const result = await session.run(
    `
    MATCH (:User { email: $email, isActive: TRUE })-[:REQUESTED_MEMBERSHIP]->(mr:MembershipRequest { status: 'PENDING' })<-[:HAS_MEMBERSHIP_REQUEST]-(b:BookClub { slug: $slug, isActive: TRUE })
    RETURN COUNT(mr) > 0 AS hasOpenRequest
    `,
    { slug, email }
  );

  // Close the session and return whether there is an open request
  session.close();
  return result.records[0].get('hasOpenRequest');
};

// TODO - Paginate
/**
 * Get the membership requests for a book club
 *
 * @param {string} slug The slug of the book club
 * @param {string} email The email of the requesting user
 * @return {Promise<UserAndMembershipRequest[]>} The membership requests
 */
export const findMembershipRequests = async (
  slug: string,
  email: string
): Promise<UserAndMembershipRequest[]> => {
  // Connect to Neo4j
  const session = driver.session();

  // Find the membership requests for the book club
  const result = await session.run(
    `
    MATCH (u:User { isActive: TRUE })-[:REQUESTED_MEMBERSHIP]->(mr:MembershipRequest)<-[:HAS_MEMBERSHIP_REQUEST]-(:BookClub { slug: $slug, isActive: TRUE })<-[ar:IS_MEMBER_OF]-(:User { email: $email, isActive: TRUE })
    WHERE ar.role IN ['ADMIN', 'OWNER']
    RETURN u, mr
    `,
    { slug, email }
  );

  // Close the session
  session.close();

  // Gather and return the user and membership request data
  return result.records.map(record => ({
    user: record.get('u').properties as UserProperties,
    request: record.get('mr').properties as MembershipRequestProperties
  }));
};
