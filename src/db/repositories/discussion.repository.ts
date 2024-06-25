'use server';

import { driver } from '@/db/connect-neo4j';
import {
  DiscussionPreview,
  DiscussionProperties,
  RepliesAndTotalPage,
  ReplyProperties,
  ReplyWithUser
} from '@/db/models/nodes';
import { int } from 'neo4j-driver';

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
 * @return {Promise<DiscussionPreview[]>} - The discussions
 */
export const findAdHocDiscussions = async (
  bookClubSlug: string,
  email: string
): Promise<DiscussionPreview[]> => {
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
    OPTIONAL MATCH (d)-[:HAS_REPLY]->(r:Reply { isActive: TRUE })<-[:REPLIED]-(:Membership)<-[:HAS_MEMBERSHIP]-(u:User)
    WITH d, r { .*, user: u { .* } }
    ORDER BY r.created DESC
    WITH d, COLLECT(r)[..2] AS latestReplies
    RETURN d {
      .*,
      replies: latestReplies
    }
    `,
    { bookClubSlug, email }
  );

  // Close the session and return the discussions
  session.close();
  return result.records.map(record => record.get('d'));
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
 * Retrieve a paginated list of discussion replies along with the total number of replies
 *
 * @param {string} bookClubSlug The slug of the book club
 * @param {string} discussionID The ID of the discussion
 * @param {string} email The user's email
 * @param {number} pageSize The number of results to return in a page
 * @param {number} pageNum The page number
 * @return {Promise<RepliesAndTotalPage>} The replies and total
 */
export const findDiscussionReplies = async (
  bookClubSlug: string,
  discussionID: string,
  email: string,
  pageSize: number,
  pageNum: number
): Promise<ReplyWithUser[]> => {
  // Connect to Neo4j
  const session = driver.session();

  // Get the replies and total
  const result = await session.run(
    `
    MATCH (bc:BookClub { slug: $bookClubSlug, isActive: TRUE })-[:HAS_DISCUSSION]->(d:Discussion { isActive: TRUE, id: $discussionID })-[:HAS_REPLY]->(r:Reply { isActive: TRUE })<-[:REPLIED]-(:Membership)<-[:HAS_MEMBERSHIP]-(u:User)
    WHERE bc.publicity = 'PUBLIC' OR (
      EXISTS((:User { email: $email, isActive: TRUE })-[:HAS_MEMBERSHIP]->(:Membership { isActive: TRUE })<-[:HAS_MEMBER]-(bc))
    )
    WITH r { .*, user: u { .* } }
    ORDER BY r.created
    SKIP $skip
    LIMIT $limit
    RETURN collect(r) AS replies
    `,
    { bookClubSlug, discussionID, email, skip: int(pageSize * pageNum), limit: int(pageSize) }
  );

  // Close the session and return
  session.close();
  return result.records[0].get('replies');
}

/**
 * Get the total number of replies for a discussion
 *
 * @param {string} bookClubSlug The slug of the book club
 * @param {string} discussionID The ID of the discussion
 * @param {string} email The user's email
 * @return {Promise<number>} The total number of replies
 */
export const countDiscussionReplies = async (
  bookClubSlug: string,
  discussionID: string,
  email: string
): Promise<number> => {
  // Connect to Neo4j
  const session = driver.session();

  // Get the replies and total
  const result = await session.run(
    `
    MATCH (bc:BookClub { slug: $bookClubSlug, isActive: TRUE })-[:HAS_DISCUSSION]->(d:Discussion { isActive: TRUE, id: $discussionID })-[:HAS_REPLY]->(r:Reply { isActive: TRUE })<-[:REPLIED]-(:Membership)<-[:HAS_MEMBERSHIP]-(u:User)
    WHERE bc.publicity = 'PUBLIC' OR (
      EXISTS((:User { email: $email, isActive: TRUE })-[:HAS_MEMBERSHIP]->(:Membership { isActive: TRUE })<-[:HAS_MEMBER]-(bc))
    )
    RETURN count(r) AS total
    `,
    { bookClubSlug, discussionID, email }
  );

  // Close the session and return the total
  session.close();
  return result.records[0].get('total').toNumber();
}

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
