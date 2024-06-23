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
  thumbnail?: string
}

/**
 * Search for books in the Google Books API
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
): Promise<GoogleAPIBook[]> => {
  // Ensure the user is authenticated
  await ensureAuth();

  // If the query is empty, return nothing
  if(query.length === 0) return [];

  // Create a new client
  const googleBooksClient = books({
    version: 'v1',
    auth: props.API.BBCM_GOOGLE_API_KEY
  });

  // Search for books
  const rsp = await googleBooksClient.volumes.list({
    q: query,
    startIndex: pageNum * pageSize,
    maxResults: pageSize
  });

  // Pull out the results, if any
  return rsp.data.items?.map(item => ({
    id: item.id,
    title: item.volumeInfo?.title,
    authors: item.volumeInfo?.authors,
    description: item.volumeInfo?.description,
    thumbnail: item.volumeInfo?.imageLinks?.thumbnail
  })) || [];
}
