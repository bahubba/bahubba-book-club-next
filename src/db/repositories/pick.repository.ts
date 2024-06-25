import { driver } from '@/db/connect-neo4j';
import { PickProperties } from '@/db/models/nodes';

/**
 * Pick a book for a book club
 *
 * @param {string} slug The slug of the book club
 * @param {string} email The email of the user
 * @param {string} bookID The ID of the book being picked
 * @param {PickProperties} pickProperties Metadata about the new pick
 * @return {Promise<boolean>} True if a pick was created
 */
export const addPick = async (
  slug: string,
  email: string,
  bookID: string,
  pickProperties: PickProperties
): Promise<boolean> => {
  // Connect to Neo4j
  const session = driver.session();

  // Create the pick
  const result = await session.run(
    `
    MATCH (:User { email: $email, isActive: TRUE })-[:HAS_MEMBERSHIP]->(m:Membership { isActive: TRUE })<-[:HAS_CURRENT_PICKER]-(bc:BookClub { slug: $slug, isActive: TRUE })
    WHERE NOT EXISTS { MATCH (bc)-[:HAS_CURRENT_PICK]->() }
    MATCH (b:Book { id: $bookID, isActive: TRUE })
    MERGE (m)-[:PICKED]->(p:Pick $pickProperties)<-[:HAS_CURRENT_PICK]-(bc)
    MERGE (bc)-[:HAS_PICK]->(p)
    MERGE (p)-[:SELECTED]->(b)
    RETURN p
    `,
    { email, slug, bookID, pickProperties }
  );

  return result.records.length > 0;
}

/**
 * Advance the current picker in a book club
 *
 * @param {string} slug The club's slug
 * @param {string} email The requesting user's email
 * @return {Promise<void>}
 */
export const advancePicker = async (
  slug: string,
  email: string
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Advance the picker
  await session.run(
    `
    MATCH (:User { email: $email, isActive: TRUE })-[:HAS_MEMBERSHIP]->(am:Membership { isActive: TRUE })<-[:HAS_MEMBER]-(bc:BookClub { slug: $slug, isActive: TRUE })-[pr:HAS_CURRENT_PICKER]->(:Membership { isActive: TRUE })-[:PICKS_BEFORE]->(np:Membership { isActive: TRUE })
    WHERE am.role IN ['ADMIN', 'OWNER']
    DELETE pr
    MERGE (bc)-[:HAS_CURRENT_PICKER]->(np)
    `,
    { email, slug }
  );

  // Close the session
  session.close();
};

/**
 * Get the current picker for a book club
 */