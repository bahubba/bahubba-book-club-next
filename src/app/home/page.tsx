import { Suspense } from 'react';
import { Spinner } from '@nextui-org/spinner';

import PageSectionLayout from '@/components/layout/page-section.layout';
import BookClubCardGridLayout from '@/components/layout/book-club-card-grid.layout';
import { getBookClubsForUser } from '@/api/fetchers/book-club.fetchers';
import CreateBookClubButton from '@/components/buttons/create-book-club.button';
import BookClubSearchButton from '@/components/buttons/book-club-search.button';

/** Async component for loading book clubs to display */
const BookClubs = async () => {
  const bookClubs = await getBookClubsForUser();

  return <BookClubCardGridLayout bookClubs={ bookClubs }/>;
};

/** The home page for the application, showing a user's clubs, books, and trending info */
const HomePage = () =>
  <div className="flex w-full h-full pb-2">
    <PageSectionLayout
      header="Clubs"
      sectionHeaderChildren={
        <div className="flex gap-0.5">
          <CreateBookClubButton/>
          <BookClubSearchButton/>
        </div>
      }
    >
      <Suspense fallback={
        <div className="flex justify-center items-center w-full h-full">
          <Spinner/>
        </div>
      }>
        <BookClubs/>
      </Suspense>
    </PageSectionLayout>
    <PageSectionLayout header="Books">
      <div>Some long text string that will take up some width</div>
    </PageSectionLayout>
    <PageSectionLayout header="Trending">
      <div>Some long text string that will take up some width</div>
    </PageSectionLayout>
  </div>;

export default HomePage;