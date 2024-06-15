import { driver } from '@/db/connect-neo4j';
import { DiscussionProperties, ReplyProperties } from '@/db/models/nodes';

/**
 * Create an ad-hoc discussion for a book club and relate the book club and member to it
 *
 * @param {string} bookClubSlug - The slug of the book club
 * @param {string} email - The email of the member
 * @param {DiscussionProperties} discussion - The properties of the discussion
 * @return {Promise<void>}
 */
export const createAdHocDiscussion = async (
  bookClubSlug: string,
  email: string,
  discussion: DiscussionProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Create the discussion node and relate it to the book club and member
  await session.run(
    `
    MATCH (bc:BookClub { slug: $bookClubSlug, isActive: TRUE })-[:HAS_MEMBER]->(m:Membership { isActive: TRUE })<-[:HAS_MEMBERSHIP]-(:User { email: $email, isActive: TRUE })
    MERGE (bc)-[:HAS_DISCUSSION]->(d:Discussion:AdHoc {
      id: $discussion.id,
      title: $discussion.title,
      description: $discussion.description,
      isActive: TRUE,
      created: $discussion.created,
      lastUpdated: $discussion.lastUpdated
    })<-[:STARTED_DISCUSSION]-(m)
    `,
    { bookClubSlug, email, discussion }
  );

  // Close the session
  session.close();
};

/**
 * Get ad-hoc discussions for a book club
 *
 * @param {string} bookClubSlug - The slug of the book club
 * @param {string} email - The email of the member
 * @return {Promise<DiscussionProperties[]>} - The discussions
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

/**
 * Retrieve a discussion
 *
 * @param {string} bookClubSlug - The slug of the book club
 * @param {string} discussionID - The slug of the discussion
 * @param {string} email - The email of the member
 * @return {Promise<DiscussionProperties>} - The discussion
 */
export const findDiscussion = async (
  bookClubSlug: string,
  discussionID: string,
  email: string
): Promise<DiscussionProperties> => {
  // Connect to Neo4j
  const session = driver.session();

  // Retrieve the discussion
  const result = await session.run(
    `
    MATCH (bc:BookClub { slug: $bookClubSlug, isActive: TRUE })-[:HAS_DISCUSSION]->(d:Discussion { id: $discussionID, isActive: TRUE })
    WHERE bc.publicity = 'PUBLIC' OR (
      EXISTS((:User { email: $email, isActive: TRUE })-[:HAS_MEMBERSHIP]->(:Membership { isActive: TRUE })<-[:HAS_MEMBER]-(bc))
    )
    RETURN d
    `,
    { bookClubSlug, discussionID, email }
  );

  // Close the session and return the discussion
  session.close();
  return result.records[0].get('d').properties;
};

/**
 * Check existence of a discussion slug within a book club
 *
 * @param {string} bookClubSlug - The slug of the book club
 * @param {string} discussionID - The slug of the discussion
 * @return {Promise<boolean>} - Whether the discussion exists
 */
export const discussionExists = async (
  bookClubSlug: string,
  discussionID: string
): Promise<boolean> => {
  // Connect to Neo4j
  const session = driver.session();

  // Check for the existence of the discussion
  const result = await session.run(
    `
      MATCH (:BookClub { slug: $bookClubSlug, isActive: TRUE })-[:HAS_DISCUSSION]->(d:Discussion { id: $discussionID, isActive: TRUE })
      RETURN count(d) > 0 AS exists
      `,
    { bookClubSlug, discussionID }
  );

  // Close the session and return the existence
  session.close();
  return result.records[0].get('exists');
};

/**
 * Reply to a discussion
 *
 * @param {string} bookClubSlug - The slug of the book club
 * @param {string} email - The email of the member replying
 * @param {string} nodeID - The ID of the discussion or reply being replied to
 * @param {ReplyProperties} reply - The properties of the reply
 * @return {Promise<void>}
 */
export const replyToDiscussion = async (
  bookClubSlug: string,
  email: string,
  nodeID: string,
  reply: ReplyProperties
): Promise<void> => {
  // Connect to Neo4j
  const session = driver.session();

  // Reply to the discussion
  await session.run(
    `
    MATCH (n { isActive: TRUE, id: $nodeID })<-[*]-(:BookClub { slug: $bookClubSlug, isActive: TRUE })-[:HAS_MEMBER]->(m:Membership { isActive: TRUE })<-[:HAS_MEMBERSHIP]-(:User { email: $email, isActive: TRUE })
    MERGE (m)-[:REPLIED]->(:Reply { id: $reply.id, content: $reply.content, isActive: $reply.isActive, created: $reply.created })<-[:HAS_REPLY]-(n)
    `,
    { bookClubSlug, email, nodeID, reply }
  );

  // Close the session
  session.close();
};
