import { driver } from '@/db/connect-neo4j';

import { IsMemberOfProperties, Role } from '../models/relationships';

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
  membershipProps: IsMemberOfProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Add the member to the club
  await session.run(
    `
    MATCH (u:User { email: $memberEmail, isActive: TRUE })
    MATCH (:User { email: $adminEmail, isActive: TRUE })-[m:IS_MEMBER_OF { isActive: TRUE }]->(b:BookClub { slug: $slug, isActive: TRUE })
    WHERE m.role IN ['ADMIN', 'OWNER']
    MERGE (u)-[:IS_MEMBER_OF {
      role: $membershipProps.role,
      joined: $membershipProps.joined,
      isActive: $membershipProps.isActive
    }]->(c)
    `,
    { slug, memberEmail, adminEmail, membershipProps }
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
    MATCH (:User { email: $memberEmail, isActive: TRUE })-[m:IS_MEMBER_OF { isActive: TRUE }]->(:BookClub { slug: $slug, isActive: TRUE })<-[a:IS_MEMBER_OF { isActive: TRUE }]-(:User { email: $adminEmail, isActive: TRUE })
    WHERE a.role IN ['ADMIN', 'OWNER']
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
    MATCH (:User { email: $memberEmail, isActive: TRUE })-[m:IS_MEMBER_OF { isActive: TRUE }]->(:BookClub { slug: $slug, isActive: TRUE })<-[a:IS_MEMBER_OF { isActive: TRUE }]-(:User { email: $adminEmail, isActive: TRUE })
    WHERE a.role IN ['ADMIN', 'OWNER']
    SET m.isActive = FALSE, m.departed = date()
    `,
    { slug, memberEmail, adminEmail }
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
    MATCH (:User { email: $email, isActive: TRUE })-[m:IS_MEMBER_OF]->(:BookClub { slug: $slug, isActive: TRUE })
    RETURN m.role AS role
    `,
    { slug, email }
  );

  // Close the session and return the user's role
  session.close();
  return result.records[0]?.get('role') ?? null;
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
    MATCH (:User { email: $userEmail, isActive: TRUE })-[m:IS_MEMBER_OF { isActive: FALSE }]->(:BookClub { slug: $slug, isActive: TRUE })<-[a:IS_MEMBER_OF { isActive: TRUE }]-(:User { email: $adminEmail, isActive: TRUE })
    WHERE a.role IN ['ADMIN', 'OWNER']
    SET m.isActive = TRUE
    REMOVE m.departed
    `,
    { slug, userEmail: memberEmail, adminEmail }
  );

  // Close the session
  session.close();
};
