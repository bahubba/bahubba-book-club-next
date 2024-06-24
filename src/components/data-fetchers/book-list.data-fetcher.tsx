import { Fragment } from 'react';
import { Divider } from '@nextui-org/divider';
import { ScrollShadow } from '@nextui-org/scroll-shadow';

import BookListItem from '@/components/lists/list-items/book.list-item';
import URLQueryPagination from '@/components/pagination/url-query.pagination';

import { searchForBooks } from '@/api/fetchers/book.fetchers';

// Component props
interface BookListDataFetcherProps {
  query: string;
  pageNum?: number;
  pageSize?: number;
  path: string;
  pickable?: boolean;
  bookClubSlug?: string;
}

/**
 * Fetcher for book club search results; Wraps the book club list
 *
 * @param {Object} props
 * @param {string} props.query The search string
 * @param {number} props.pageNum The page number for results
 * @param {pageSize} props.pageSize The number of results per page
 * @param {boolean} props.pickable Whether a book in the list can be picked
 * @param {string} props.bookClubSlug If pickable, the slug of the book club being picked for
 */
const BookListDataFetcher = async ({
  query,
  pageNum = 1,
  pageSize = 25,
  path,
  pickable = false,
  bookClubSlug
}: BookListDataFetcherProps) => {
  // Search for books
  const bookResults = await searchForBooks(query, pageNum, pageSize);

  return !bookResults.books.length ? <></> : (
    <>
      <ScrollShadow
        className="flex-1 flex flex-col h-1 w-full gap-y-2"
        hideScrollBar
      >
        {
          bookResults.books.map((book, idx) => (
            <Fragment key={book.id ?? idx} >
              <BookListItem
                book={book}
                pickable={pickable}
                bookClubSlug={bookClubSlug}
              />
              { idx < bookResults.books.length - 1 && <Divider />}
            </Fragment>
          ))
        }
      </ScrollShadow>
      <div className="flex-shrink flex-grow-0 flex justify-center items-center w-full">
        <URLQueryPagination
          urlPrefix={`${path}?query=${query}&`}
          pageNum={pageNum}
          pageSize={pageSize}
          total={Math.ceil(bookResults.total / pageSize)}
        />
      </div>
    </>
  )
};

export default BookListDataFetcher;