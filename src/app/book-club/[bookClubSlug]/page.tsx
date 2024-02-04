import { Suspense } from 'react';

import PageSectionLayout from '@/components/layout/page-section.layout';
import SectionHeaderLayout from '@/components/layout/section-header.layout';
import RequestMembershipButton from '@/components/buttons/request-membership.button';
import BookClubAdminButton from '@/components/buttons/book-club-admin.button';
import {
  getBookClubName,
  getBookClubRole
} from '@/api/fetchers/book-club.fetchers';
import { Role } from '@/db/models/book-club.models';

// Component props
interface BookClubHomePageProps {
  params: {
    bookClubSlug: string;
  };
}

/**
 * Async component for displaying the book club admin button or the request membership button
 *
 * @param {Object} props - The component props
 * @param {string} props.bookClubSlug - The slug of the book club
 */
const BookClubButtons = async ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => {
  // Fetch the user's role
  const role = await getBookClubRole(bookClubSlug);

  // If the user is an admin, show the admin button
  return (
    <div className="flex-1 justify-start">
      {!!role && [Role.ADMIN, Role.OWNER].includes(role) ? (
        <BookClubAdminButton bookClubSlug={bookClubSlug} />
      ) : (
        <>{!role && <RequestMembershipButton bookClubSlug={bookClubSlug} />}</>
      )}
    </div>
  );
};

/**
 * Async component for displaying the book club name
 *
 * @param {Object} props - The component props
 * @param {string} props.bookClubSlug - The slug of the book club
 */
const BookClubPageHeader = async ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => {
  // Fetch the book club name
  const bookClubName = await getBookClubName(bookClubSlug);

  return (
    <div className="flex-shrink">
      <h1 className="text-3xl font-bold">{bookClubName}</h1>
    </div>
  );
};

/**
 * Book club home page
 *
 * @param props - Page props
 * @param props.params - Page params
 * @param props.params.bookClubSlug - Slug of the book club name from the URL path
 */
const BookClubHomePage = ({
  params: { bookClubSlug }
}: Readonly<BookClubHomePageProps>) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-shrink ms-2 mb-2">
        <div className="flex items-center">
          <SectionHeaderLayout
            title={
              <Suspense fallback={<></>}>
                <BookClubPageHeader bookClubSlug={bookClubSlug} />
              </Suspense>
            }
          >
            <Suspense fallback={<></>}>
              <BookClubButtons bookClubSlug={bookClubSlug} />
            </Suspense>
          </SectionHeaderLayout>
        </div>
      </div>
      <div className="flex flex-1 w-full">
        <PageSectionLayout header="Members">
          <span>Members go here</span>
        </PageSectionLayout>
        <PageSectionLayout header="Books">
          <div>Some long text string that will take up some width</div>
        </PageSectionLayout>
        <PageSectionLayout header="Discussions">
          <div>Some long text string that will take up some width</div>
        </PageSectionLayout>
      </div>
    </div>
  );
};

export default BookClubHomePage;
