'use server';

import { books } from '@googleapis/books';

import { ensureAuth } from '@/api/auth.api';
import props from '@/util/properties';

// Interface for books transformed from the Google Books API
export interface GoogleAPIBook {
  id?: string | null,
  title?: string,
  authors?: string[],
  description?: string,
  thumbnail?: string,
  identifiers?: Array<{identifier?: string; type?: string}>
}

// Interface for the return value, to include the books and the total number of results
export interface BookSearchResults {
  books: GoogleAPIBook[];
  total: number;
}

/**
 * Search for books in the Google Books API
 * TODO - The API returns a different total with different start indices
 *
 * @param {string} query The search string
 * @param {number} pageNum The page number for the results
 * @param {number} pageSize The number of results per page
 * @return {GoogleAPIBook[]} A page/list of book results
 */
export const searchForBooks = async (
  query: string,
  pageNum: number,
  pageSize: number
): Promise<BookSearchResults> => {
  // Ensure the user is authenticated
  await ensureAuth();

  // If the query is empty, return nothing
  if(query.length === 0) return { books: [], total: 0 };

  // Create a new client
  const googleBooksClient = books({
    version: 'v1',
    auth: props.API.BBCM_GOOGLE_API_KEY
  });

  // Search for books
  const rsp = await googleBooksClient.volumes.list({
    q: query,
    startIndex: pageNum * pageSize,
    maxResults: pageSize,
    orderBy: 'relevance'
  });

  // Pull out the results, if any
  return {
    books: rsp.data.items?.map(item => ({
      id: item.id,
      title: item.volumeInfo?.title,
      authors: item.volumeInfo?.authors,
      description: item.volumeInfo?.description,
      thumbnail: item.volumeInfo?.imageLinks?.thumbnail,
      identifiers: item.volumeInfo?.industryIdentifiers,
      publishDate: item.volumeInfo?.publishedDate
    })) || [],
    total: rsp.data.totalItems || 0
  };
}
