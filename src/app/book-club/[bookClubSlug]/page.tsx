import { Suspense } from 'react';
import { Spinner } from '@nextui-org/react';

import PageSectionLayout from '@/components/layout/page-section.layout';
import SectionHeaderLayout from '@/components/layout/section-header.layout';
import RequestMembershipButton from '@/components/buttons/request-membership.button';
import DiscussionCard from '@/components/cards/discussion.card';
import LinkButton from '@/components/buttons/link.button';
import AdminIcon from '@/components/icons/admin.icon';
import BookClubPickOrderList from '@/components/lists/book-club-pick-order.list';
import {
  getBookClubName,
  getBookClubRole
} from '@/api/fetchers/book-club.fetchers';
import { getBookClubPickList } from '@/api/fetchers/membership.fetchers';
import { getAdHocDiscussions } from '@/api/fetchers/discussion.fetchers';
import { Role } from '@/db/models/nodes';
import PlusIcon from '@/components/icons/plus.icon';
import Link from 'next/link';

// Component props
interface BookClubHomePageProps {
  params: {
    bookClubSlug: string;
  };
}

/**
 * Async component for fetching and displaying ad-hoc discussions
 *
 * @param {Object} props - Component props
 * @param {string} props.bookClubSlug - The slug of the book club
 */
const AdHocDiscussions = async ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => {
  // Fetch the ad-hoc discussions
  const discussions = await getAdHocDiscussions(bookClubSlug);

  return (
    <div className="flex flex-col gap-y-2 p-2">
      {discussions.map(discussion => (
        <DiscussionCard
          key={discussion.title}
          discussion={discussion}
        />
      ))}
    </div>
  );
};

/**
 * Async component for fetching and displaying the pick order
 *
 * @param {Object} props - Component props
 * @param {string} props.bookClubSlug - The slug of the book club
 */
const PickOrderWrapper = async ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => {
  // Fetch the pick order and user's role
  const pickOrder = await getBookClubPickList(bookClubSlug);
  const memberRole = await getBookClubRole(bookClubSlug);

  return (
    <BookClubPickOrderList
      pickOrder={pickOrder}
      bookClubSlug={bookClubSlug}
      memberRole={memberRole as Role}
    />
  );
};

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
        <LinkButton
          uri={`/book-club/${bookClubSlug}/admin/details`}
          tooltip="Book Club Admin"
        >
          <AdminIcon />
        </LinkButton>
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

  return <>{bookClubName}</>;
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
    <div className="flex-1 flex flex-col h-full pb-2">
      <SectionHeaderLayout
        title={
          <h1 className="flex-shrink flex items-center ms-2 my-2 text-3xl font-bold">
            <Suspense fallback={<></>}>
              <BookClubPageHeader bookClubSlug={bookClubSlug} />
            </Suspense>
          </h1>
        }
      >
        <Suspense fallback={<></>}>
          <BookClubButtons bookClubSlug={bookClubSlug} />
        </Suspense>
      </SectionHeaderLayout>
      <div className="flex flex-1 w-full">
        <PageSectionLayout header="Members">
          <Suspense
            fallback={
              <div className="flex justify-center items-center w-full h-36">
                <Spinner />
              </div>
            }
          >
            <PickOrderWrapper bookClubSlug={bookClubSlug} />
          </Suspense>
        </PageSectionLayout>
        <PageSectionLayout header="Books">
          <div>Some long text string that will take up some width</div>
        </PageSectionLayout>
        <PageSectionLayout
          header={
            <Link href={`/book-club/${bookClubSlug}/discussions`}>
              Discussions
            </Link>
          }
          sectionHeaderChildren={
            <LinkButton
              uri={`/book-club/${bookClubSlug}/discussions/create`}
              tooltip="Create a discussion"
            >
              <PlusIcon />
            </LinkButton>
          }
        >
          <Suspense
            fallback={
              <div className="flex justify-center items-center w-full h-36">
                <Spinner />
              </div>
            }
          >
            <AdHocDiscussions bookClubSlug={bookClubSlug} />
          </Suspense>
          <span>Link to add discussion goes here</span>
        </PageSectionLayout>
      </div>
    </div>
  );
};

export default BookClubHomePage;
