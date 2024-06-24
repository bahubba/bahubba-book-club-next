import { Suspense } from 'react';
import { Divider } from '@nextui-org/divider';

import BookClubHeader from '@/components/data-fetchers/book-club-name.data-fetcher';
import BookSearchForm from '@/components/forms/book-search.form';
import BookListDataFetcher from '@/components/data-fetchers/book-list.data-fetcher';
import { Spinner } from '@nextui-org/spinner';

// Component props
interface PickBookPageProps {
  params: {
    bookClubSlug: string;
  };
  searchParams: {
    query?: string;
    pageNum?: string;
    pageSize?: string;
  };
}

/**
 * Page for picking a book club
 *
 * @param {Object} props Component props
 * @param {Object} props.params URL slugs as params
 * @param {string} props.params.bookClubSlug The slug of the book club being picked for
 * @param {Object} props.searchParams URL query params
 * @param {string} props.searchParams.query The search query for finding a book
 * @param {string} props.searchParams.pageNum The page number of the search results
 * @param {string} props.searchParams.pageSize The number of results to return per page
 */
const PickBookPage = async ({
  params: { bookClubSlug },
  searchParams: {
    query = '',
    pageNum = '1',
    pageSize = '25'
  }
}: PickBookPageProps) => (
  <div className="flex flex-col h-full pb-2">
    <div className="flex-shrink flex-grow-0 flex justify-between items-center">
      <h1 className="ms-2 my-2 text-3xl font-bold">
        <BookClubHeader
          bookClubSlug={bookClubSlug}
          prefix="Pick for "
        />
      </h1>
    </div>
    <div className="flex-shrink flex-grow-0 flex justify-center">
      <BookSearchForm urlPath={`/book-club/${bookClubSlug}/pick-book`} />
    </div>
    <Divider className="flex-shrink flex-grow-0 my-2" />
    {
      query.length === 0 ? (
        <div className="flex justify-center items-center w-full h-full">
          <span className="italic">Search for a book...</span>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="flex justify-center items-center w-full h-full">
              <Spinner/>
            </div>
          }
        >
          <BookListDataFetcher
            query={query}
            pageNum={parseInt(pageNum)}
            pageSize={parseInt(pageSize)}
            path={`/book-club/${bookClubSlug}/pick-book`}
          />
        </Suspense>
      )
    }
  </div>
);

export default PickBookPage;