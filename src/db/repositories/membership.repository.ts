import { driver } from '@/db/connect-neo4j';

import { MembershipProperties, Role } from '../models/nodes';

/**
 * Add a member to a book club
 *
 * @param {string} slug The club's slug
 * @param {string} memberEmail The new member's email
 * @param {string} adminEmail The requesting admin's email
 * @param {IsMemberOfProperties} membershipProps The properties for the membership relationship
 * @return {Promise<void>}
 */
export const addMember = async (
  slug: string,
  memberEmail: string,
  adminEmail: string,
  membershipProps: MembershipProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Add the member to the club
  await session.run(
    `
    MATCH (u:User { email: $memberEmail, isActive: TRUE })
    MATCH (:User { email: $adminEmail, isActive: TRUE })-[:HAS_MEMBERSHIP]->(m:Membership { isActive: TRUE })<-[:HAS_MEMBER]-(b:BookClub { slug: $slug, isActive: TRUE })
    WHERE m.role IN ['ADMIN', 'OWNER']
    MERGE (u)-[:HAS_MEMBERSHIP]->(:Membership {
      role: $membershipProps.role,
      joined: $membershipProps.joined,
      isActive: $membershipProps.isActive
    })<-[:HAS_MEMBER]-(b)
    `,
    { slug, memberEmail, adminEmail, membershipProps }
  );

  // Add the member as the last picker
  await session.run(
    `
    MATCH (:User { email: $memberEmail, isActive: TRUE })-[:HAS_MEMBERSHIP]->(m:Membership { isActive: TRUE })<-[:HAS_MEMBER]-(:BookClub { slug: $slug, isActive: TRUE })-[h:HAS_CURRENT_PICKER]->(c:Membership { isActive: TRUE })<-[p:PICKS_BEFORE]-(l:Membership { isActive: TRUE })
    DELETE p
    MERGE (l)-[:PICKS_BEFORE]->(m)-[:PICKS_BEFORE]->(c)
    `,
    { slug, memberEmail }
  );

  // Close the session
  session.close();
};

/**
 * Update a member's role in a club
 *
 * @param {string} slug The club's slug
 * @param {string} memberEmail The member's email
 * @param {string} adminEmail The requesting admin's email
 * @param {Role} newRole The member's new role
 * @return {Promise<void>}
 */
export const updateMemberRole = async (
  slug: string,
  memberEmail: string,
  adminEmail: string,
  newRole: Role
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Update the member's role
  await session.run(
    `
    MATCH (:User { email: $memberEmail, isActive: TRUE })-[:HAS_MEMBERSHIP]->(m:Membership { isActive: TRUE })<-[:HAS_MEMBER]-(:BookClub { slug: $slug, isActive: TRUE })-[:HAS_MEMBER]->(am:Membership { isActive: TRUE })<-[:HAS_MEMBERSHIP]-(:User { email: $adminEmail, isActive: TRUE })
    WHERE am.role IN ['ADMIN', 'OWNER']
    SET m.role = $newRole
    `,
    { slug, memberEmail, adminEmail, newRole }
  );

  // Close the session
  session.close();
};

/**
 * Remove a member from a book club
 *
 * @param {string} slug The club's slug
 * @param {string} memberEmail The member's email
 * @param {string} adminEmail The requesting admin's email
 * @return {Promise<void>}
 */
export const removeMember = async (
  slug: string,
  memberEmail: string,
  adminEmail: string
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Remove the member from the club
  await session.run(
    `
    MATCH (:User { email: $memberEmail, isActive: TRUE })-[:HAS_MEMBERSHIP]->(m:Membership { isActive: TRUE })<-[:HAS_MEMBER]-(:BookClub { slug: $slug, isActive: TRUE })-[:HAS_MEMBER]->(am:Membership { isActive: TRUE })<-[:HAS_MEMBERSHIP]-(:User { email: $adminEmail, isActive: TRUE })
    WHERE am.role IN ['ADMIN', 'OWNER']
    SET m.isActive = FALSE, m.departed = date()
    `,
    { slug, memberEmail, adminEmail }
  );

  // Close the session
  session.close();
};

/**
 * Reinstate a user's membership in a book club
 *
 * @param {string} slug The club's slug
 * @param {string} memberEmail The user's email
 * @param {string} adminEmail The requesting admin's email
 * @return {Promise<void>}
 */
export const reinstateMember = async (
  slug: string,
  memberEmail: string,
  adminEmail: string
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Reinstate the user's membership
  await session.run(
    `
    MATCH (:User { email: $userEmail, isActive: TRUE })-[:HAS_MEMBERSHIP]->(m:Membership { isActive: FALSE })<-[:HAS_MEMBER]-(:BookClub { slug: $slug, isActive: TRUE })-[:HAS_MEMBER]->(am:Membership { isActive: TRUE })<-[:HAS_MEMBERSHIP]-(:User { email: $adminEmail, isActive: TRUE })
    WHERE am.role IN ['ADMIN', 'OWNER']
    SET m.isActive = TRUE
    REMOVE m.departed
    `,
    { slug, userEmail: memberEmail, adminEmail }
  );

  // Close the session
  session.close();
};

/**
 * Find a user's role in a book club by slug
 *
 * @param {string} slug The slug of the book club
 * @param {string} email The email of the user to search for
 * @return {Promise<Role | null>} The user's role in the book club, or null if they are not a member
 */
export const findBookClubRole = async (
  slug: string,
  email: string
): Promise<Role | null> => {
  // Connect to Neo4j
  const session = driver.session();

  // Find the user's role in the book club
  const result = await session.run(
    `
    MATCH (:User { email: $email, isActive: TRUE })-[:HAS_MEMBERSHIP]->(m:Membership { isActive: TRUE })<-[:HAS_MEMBER]-(:BookClub { slug: $slug, isActive: TRUE })
    RETURN m.role AS role
    `,
    { slug, email }
  );

  // Close the session and return the user's role
  session.close();
  return result.records[0]?.get('role') ?? null;
};

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
  isActive = true
): Promise<boolean> => {
  // Connect to Neo4j
  const session = driver.session();

  // Check the user's membership
  const result = await session.run(
    `
    MATCH (:User { email: $userEmail, isActive: TRUE })-[:HAS_MEMBERSHIP]->(m:Membership { isActive: $isActive })<-[:HAS_MEMBER]-(:BookClub { slug: $slug, isActive: TRUE })
    RETURN COUNT(m) > 0 AS isMember
    `,
    { slug, userEmail, isActive }
  );

  // Close the session and return whether the user is a member
  session.close();
  return result.records[0].get('isMember');
};
