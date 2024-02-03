import { Suspense } from 'react';
import { Spinner } from '@nextui-org/spinner';

import { getMembershipRequests } from '@/api/fetchers/membership-request.fetchers';
import MembershipRequestsTable from '@/components/tables/membership-requests.table';

// Page props
interface BookClubAdminMembershipRequestsPageProps {
  params: {
    bookClubSlug: string;
  };
}

/**
 * Async component for displaying membership requests table
 *
 * @prop {Object} props - Component props
 * @prop {string} props.bookClubSlug - Book club slug
 */
const BookClubAdminMembershipRequestsTableWrapper = async ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => {
  // Fetch the membership requests
  const membershipRequests = await getMembershipRequests(bookClubSlug);

  return <MembershipRequestsTable membershipRequests={membershipRequests} />;
};

/**
 * Page for managing membership requests for a book club
 *
 * @prop {Object} props Component props
 * @prop {Object} props.params The parameters of the page
 * @prop {string} props.params.bookClubSlug The slug of the book club
 */
const BookClubAdminMembershipRequestsPage = ({
  params: { bookClubSlug }
}: Readonly<BookClubAdminMembershipRequestsPageProps>) => (
  <Suspense
    fallback={
      <div className="flex justify-center items-center w-full h-36">
        <Spinner />
      </div>
    }
  >
    <BookClubAdminMembershipRequestsTableWrapper bookClubSlug={bookClubSlug} />
  </Suspense>
);

export default BookClubAdminMembershipRequestsPage;
