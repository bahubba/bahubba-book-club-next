import { driver } from '@/db/connect-neo4j';
import { BookClubProperties, Publicity } from '@/db/models/nodes';
import {
  BookClubMembership,
  IsMemberOfProperties
} from '@/db/models/relationships';

/**
 * Add a book club node with the user as an owner
 *
 * @param {string} email The email of the user adding the book club
 * @param {BookClubProperties} bookClub The properties for the book club
 * @param {IsMemberOfProperties} membershipProps The properties for the membership relationship
 * @return {Promise<void>}
 */
export const addBookClub = async (
  email: string,
  bookClub: BookClubProperties,
  membershipProps: IsMemberOfProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Create a book club node and a membership relationship for the user as an owner
  await session.run(
    `
      MATCH (u:User { email: $email, isActive: TRUE })
      MERGE (c:BookClub {
        name: $bookClub.name,
        slug: $bookClub.slug,
        description: $bookClub.description,
        image: $bookClub.image,
        publicity: $bookClub.publicity,
        isActive: TRUE
      })
      MERGE (u)-[:IS_MEMBER_OF {
        role: $membershipProps.role,
        joined: $membershipProps.joined,
        isActive: TRUE
      }]->(c)
      RETURN c
      `,
    { email, bookClub, membershipProps }
  );

  // Close the session
  session.close();
};

/**
 * Update a book club node
 *
 * @param {string} slug The slug of the existing book club node to update
 * @param {email} email The email of the user updating the book club
 * @param {BookClubProperties} bookClub The new properties for the book club node
 */
export const updateBookClub = async (
  slug: string,
  email: string,
  bookClub: BookClubProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Update the book club node
  await session.run(
    `
    MATCH (:User { email: $email, isActive: TRUE })-[m:IS_MEMBER_OF { isActive: TRUE }]->(b:BookClub { slug: $slug, isActive: TRUE })
    WHERE m.role IN ['ADMIN', 'OWNER']
    SET b = $bookClub
    `,
    { slug, email, bookClub }
  );
};

/**
 * Checks if a book club exists with a given slug
 *
 * @param {string} slug The slug of the book club to check
 * @return {Promise<boolean>} True if the book club exists, false otherwise
 */
export const bookClubExists = async (slug: string): Promise<boolean> => {
  // Connect to Neo4j
  const session = driver.session();

  // Query for the existence of the book club
  const result = await session.run(
    `
      MATCH (b:BookClub { slug: $slug, isActive: TRUE })
      RETURN COUNT(b) > 0 AS bookClubExists
      `,
    { slug }
  );

  // Close the session and return
  session.close();
  return result.records[0].get('bookClubExists');
};

/**
 * Finds all book club nodes for a given user
 *
 * @param {string} email The email of the user to search for
 * @return {Promise<BookClubProperties>} The book club nodes for the user
 */
export const findBookClubs = async (
  email: string
): Promise<BookClubProperties[]> => {
  // Connect to Neo4j
  const session = driver.session();

  // Find the book clubs for the user
  const result = await session.run(
    `
      MATCH (u:User { email: $email, isActive: TRUE })-[:IS_MEMBER_OF]->(b:BookClub { isActive: TRUE })
      RETURN b
      `,
    { email }
  );

  // Close the session and return the book clubs
  session.close();
  return result.records.map(
    record => record.get('b').properties
  ) as BookClubProperties[];
};

/**
 * Fetch a book club by its slug
 *
 * @param {string} slug The slug of the book club to fetch
 * @param {string} email The email of the user to search for
 * @return {Promise<BookClubProperties | null>} The book club with the given slug, or null if it doesn't exist
 */
export const findBookClub = async (
  slug: string,
  email: string
): Promise<BookClubProperties | null> => {
  // Connect to Neo4j
  const session = driver.session();

  // Find the book club by its slug, where the user has a role in the book club
  const result = await session.run(
    `
    MATCH (:User { email: $email, isActive: TRUE })-[:IS_MEMBER_OF]->(b:BookClub { slug: $slug, isActive: TRUE })
    RETURN b
    `,
    { slug, email }
  );

  // Close the session and return the book club
  session.close();
  return result.records[0]?.get('b')?.properties ?? null;
};

/**
 * Find a book club where the user is an admin or owner
 *
 * @param {string} slug The slug of the book club to find
 * @param {string} email The email of the user
 * @return {Promise<BookClubProperties | null>} The book club if found, null otherwise
 */
export const findBookClubForAdmin = async (
  slug: string,
  email: string
): Promise<BookClubProperties | null> => {
  // Connect to Neo4j
  const session = driver.session();

  // Find the book club where the user is an admin or owner
  const result = await session.run(
    `
    MATCH (:User { email: $email, isActive: TRUE })-[m:IS_MEMBER_OF { isActive: TRUE }]->(b:BookClub { slug: $slug, isActive: TRUE })
    WHERE m.role IN ['ADMIN', 'OWNER']
    RETURN b
    `,
    { email, slug }
  );

  // Close the session and return the book club
  session.close();
  return result.records[0]?.get('b')?.properties ?? null;
};

/**
 * Search for book clubs by name or description
 *
 * @param {string} email The email of the searching user
 * @param {string} search The search term to find book clubs by
 */
export const findBookClubsBySearch = async (
  email: string,
  search: string
): Promise<BookClubProperties[]> => {
  // Connect to Neo4j
  const session = driver.session();

  // Search for book clubs that are public or private and of which the user is a member
  const result = await session.run(
    `
    MATCH (b:BookClub { isActive: TRUE })
    WHERE (
      toLower(b.name) CONTAINS toLower($search) OR
      toLower(b.description) CONTAINS toLower($search)
    ) AND (
      b.publicity = 'PUBLIC' OR (
        EXISTS((:User { email: $email, isActive: TRUE })-[:IS_MEMBER_OF]->(b))
      )
    )
    RETURN b
    `,
    { email, search }
  );

  // Close the session and return the book clubs
  session.close();
  return result.records.map(
    record => record.get('b').properties
  ) as BookClubProperties[];
};

/**
 * Find a book club's publicity by its slug
 *
 * @param {string} slug The slug of the book club
 * @param {email} email The email of the requesting user
 * @return {Promise<Publicity | null>} The publicity of the book club, or null if not found
 */
export const findBookClubPublicity = async (
  slug: string
): Promise<Publicity | null> => {
  // Connect to Neo4j
  const session = driver.session();

  // Find the book club's publicity
  const result = await session.run(
    `
    MATCH (b:BookClub { slug: $slug, isActive: TRUE })
    RETURN b.publicity AS publicity
    `,
    { slug }
  );

  // Close the session and return the publicity
  session.close();
  return result.records[0]?.get('publicity') ?? null;
};

/**
 * Find a book club's members by its slug
 *
 * @param {string} slug The slug of the book club to find
 * @return {Promise<BookClubMembership[]>} The members of the book club
 */
export const findBookClubMembers = async (
  slug: string
): Promise<BookClubMembership[]> => {
  // Connect to Neo4j
  const session = driver.session();

  // Find the members of the book club
  const result = await session.run(
    `
    MATCH (u:User { isActive: TRUE })-[m:IS_MEMBER_OF { isActive: TRUE }]->(:BookClub { slug: $slug, isActive: TRUE })
    RETURN m, u
    `,
    { slug }
  );

  // Close the session
  session.close();

  // Return the members
  return result.records.map(record => ({
    ...record.get('m').properties,
    email: record.get('u').properties.email,
    preferredName: record.get('u').properties.preferredName
  })) as BookClubMembership[];
};

/**
 * Find a book club's name where the user is a member
 *
 * @param {string} slug The slug of the book club
 * @param {string} email The email of the user
 * @return {Promise<string | null>} The name of the book club, or null if the user is not a member
 */
export const findBookClubName = async (
  slug: string,
  email: string
): Promise<string | null> => {
  // Connect to Neo4j
  const session = driver.session();

  // Find the book club's name
  const result = await session.run(
    `
    MATCH (:User { email: $email, isActive: TRUE })-[:IS_MEMBER_OF { isActive: TRUE }]->(b:BookClub { slug: $slug, isActive: TRUE })
    RETURN b.name AS name
    `,
    { slug, email }
  );

  // Close the session and return the name
  session.close();
  return result.records[0]?.get('name') ?? null;
};
