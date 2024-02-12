import { driver } from '@/db/connect-neo4j';
import { DiscussionProperties } from '@/db/models/nodes';

/**
 * Create an ad-hoc discussion for a book club and relate the book club and member to it
 *
 * @param {string} bookClubSlug - The slug of the book club
 * @param {string} memberEmail - The email of the member
 * @param {DiscussionProperties} discussion - The properties of the discussion
 * @return {Promise<void>}
 */
export const createDiscussion = async (
  bookClubSlug: string,
  memberEmail: string,
  discussion: DiscussionProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Create the discussion node and relate it to the book club and member
  await session.run(
    `
    MATCH (bc:BookClub { slug: $bookClubSlug, isActive: TRUE })-[:HAS_MEMBER]->(m:Membership { isActive: TRUE })<-[:HAS_MEMBERSHIP]-(:User { email: $memberEmail, isActive: TRUE })
    MERGE (bc)-[:HAS_DISCUSSION]->(d:Discussion:AdHoc {
      title: $discussion.title,
      description: $discussion.description,
      isActive: TRUE,
      created: $discussion.created,
      lastUpdated: $discussion.lastUpdated
    })<-[:STARTED_DISCUSSION]-(m)
    `,
    { bookClubSlug, memberEmail, discussion }
  );

  // Close the session
  session.close();
};

/**
 * Get ad-hoc discussions for a book club
 *
 * @param {string} bookClubSlug - The slug of the book club
 * @param {string} email - The email of the member
 * @return {Promise<DiscussionProperties[]>}
 */
export const findAdHocDiscussions = async (
  bookClubSlug: string,
  email: string
): Promise<DiscussionProperties[]> => {
  // Connect to Neo4j
  const session = driver.session();

  // Get the discussions
  // TODO - paginate
  const result = await session.run(
    `
    MATCH (bc:BookClub { slug: $bookClubSlug, isActive: TRUE })-[:HAS_DISCUSSION]->(d:Discussion:AdHoc { isActive: TRUE })
    WHERE bc.publicity = 'PUBLIC' OR (
      EXISTS((:User { email: $email, isActive: TRUE })-[:HAS_MEMBERSHIP]->(:Membership { isActive: TRUE })<-[:HAS_MEMBER]-(bc))
    )
    RETURN d
    `,
    { bookClubSlug, email }
  );

  // Close the session and return the discussions
  session.close();
  return result.records.map(record => record.get('d').properties);
};
