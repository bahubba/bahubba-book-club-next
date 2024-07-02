import { driver } from '@/db/connect-neo4j';
import { AuthorProperties } from '@/db/models/nodes';

/**
 * Add a temporary author node (needs to be confirmed by a moderator)
 *
 * @param {AuthorProperties} authorProperties Info about the author
 * @return {Promise<boolean>} True if a new author node was created
 */
export const addTempAuthor = async (authorProperties: AuthorProperties): Promise<boolean> => {
  // Connect to Neo4j
  const session = driver.session();

  // Create the new temp author node
  const result = await session.run(
    'CREATE (a:Author $authorProperties) RETURN a',
    { authorProperties }
  );

  // Close the session and return
  session.close();
  return result.records.length > 0;
}

/**
 * Find Google Books API authors that don't have nodes
 *
 * @param {string[]} authors Authors (by Google Books API name) to search for
 * @return {Promise<string[]>} Authors that don't have an internal node
 */
export const findMissingGoogleAuthors = async (authors: string[]): Promise<string[]> => {
  // Connect to Neo4j
  const session = driver.session();

  // TODO - Find missing authors

  // TODO - Close session and return
  session.close();
  return [];
}