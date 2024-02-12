import { Suspense } from 'react';
import { Spinner } from '@nextui-org/spinner';

import PageSectionLayout from '@/components/layout/page-section.layout';
import BookClubCardGridLayout from '@/components/layout/book-club-card-grid.layout';
import { getBookClubs } from '@/api/fetchers/book-club.fetchers';
import LinkButton from '@/components/buttons/link.button';
import SearchIcon from '@/components/icons/search.icon';
import PlusIcon from '@/components/icons/plus.icon';

/** Async component for loading book clubs to display */
const BookClubs = async () => {
  const bookClubs = await getBookClubs();

  // TODO - add key
  return <BookClubCardGridLayout bookClubs={bookClubs} />;
};

/** The home page for the application, showing a user's clubs, books, and trending info */
const HomePage = () => (
  <div className="flex-1 flex flex-col h-full pb-2">
    <h1 className="flex-shrink ms-2 mb-2 text-3xl font-bold">Home</h1>
    <div className="flex-1 flex w-full pb-2">
      <PageSectionLayout
        header="Clubs"
        sectionHeaderChildren={
          <div className="flex gap-0.5">
            <LinkButton
              uri="/book-club/create"
              tooltip="Create a book club"
            >
              <PlusIcon />
            </LinkButton>
            <LinkButton
              uri="/book-club/search"
              tooltip="Search for book clubs"
            >
              <SearchIcon />
            </LinkButton>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="flex justify-center items-center w-full h-full">
              <Spinner />
            </div>
          }
        >
          <BookClubs />
        </Suspense>
      </PageSectionLayout>
      <PageSectionLayout header="Books">
        <div>Some long text string that will take up some width</div>
      </PageSectionLayout>
      <PageSectionLayout header="Trending">
        <div>Some long text string that will take up some width</div>
      </PageSectionLayout>
    </div>
  </div>
);

export default HomePage;
