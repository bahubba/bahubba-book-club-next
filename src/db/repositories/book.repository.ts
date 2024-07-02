import { driver } from '@/db/connect-neo4j';
import { BookProperties } from '@/db/models/nodes';

/**
 * Create a book node
 *
 * @param {BookProperties} bookProperties Properties for the new book node
 * @return {Promise<boolean>} True if a new book was created
 */
export const addBook = async (bookProperties: BookProperties): Promise<boolean> => {
  // Connect to Neo4j
  const session = driver.session();

  // Create the book node
  const result = await session.run(
    `
    CREATE (b:Book $bookProperties)
    RETURN b
    `,
    { bookProperties }
  );

  // Close the session and return
  session.close();
  return result.records.length > 0;
}

/**
 * Check if we have a node for a book by its ID in the Google Books API
 *
 * @param {string} googleBooksID The Google Books API ID to search for
 * @return {Promise<boolean>} The existence of the book in Neo4j
 */
export const bookExists = async (
  googleBooksID: string
): Promise<boolean> => {
  // Connect to Neo4j
  const session = driver.session();

  // Query for existence of the book
  const result = await session.run(
    `
    RETURN EXISTS {
      MATCH (b:Book { googleBooksID: $googleBooksID })
    } as bookExists
    `,
    { googleBooksID }
  );

  // Close the session and return
  session.close();
  return result.records[0].get('bookExists');
}