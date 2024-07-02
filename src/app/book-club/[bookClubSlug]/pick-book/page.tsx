import { Suspense } from 'react';
import { Divider } from '@nextui-org/divider';
import { Spinner } from '@nextui-org/spinner';

import BookClubHeader from '@/components/data-fetchers/book-club-name.data-fetcher';
import BookSearchForm from '@/components/forms/book-search.form';
import BookListDataFetcher from '@/components/data-fetchers/book-list.data-fetcher';
import { getBookClubName } from '@/api/fetchers/book-club.fetchers';

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
 * Async component for loading the book club name before rendering the book list (necessary for picking)
 *
 * @param {Readonly<{ bookClubSlug: string }>} props Component props
 * @param {string} props.bookClubSlug
 */
const BookListLoader = async ({ bookClubSlug }: Readonly<{ bookClubSlug: string }>)=> {
  // Fetch the book club's name
  const bookClubName = await getBookClubName(bookClubSlug);
}

/**
 * Page for picking a book club
 *
 * @param {Readonly<PickBookPageProps>} props Component props
 * @param {{ bookClubSlug: string }} props.params URL slugs as params
 * @param {string} props.params.bookClubSlug The slug of the book club being picked for
 * @param {{ query?: string, pageNum?: string, pageSize?: string }} props.searchParams URL query params
 * @param {string} props.searchParams.query The search query for finding a book
 * @param {string} props.searchParams.pageNum The page number of the search results
 * @param {string} props.searchParams.pageSize The number of results to return per page
 */
const PickBookPage = async (
  {
    params: { bookClubSlug },
    searchParams: {
      query = '',
      pageNum = '1',
      pageSize = '25'
    }
  }: Readonly<PickBookPageProps>
) => (
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
              <Spinner />
            </div>
          }
        >
          <BookListDataFetcher
            query={query}
            pageNum={parseInt(pageNum)}
            pageSize={parseInt(pageSize)}
            path={`/book-club/${bookClubSlug}/pick-book`}
            pickable
            bookClubSlug={bookClubSlug}
          />
        </Suspense>
      )
    }
  </div>
);

export default PickBookPage;