import { Suspense } from 'react';
import { Spinner } from '@nextui-org/spinner';

import { getBookClubPickList } from '@/api/fetchers/membership.fetchers';
import BookClubPickOrderList from '@/components/lists/book-club-pick-order.list';
import { getBookClubRole } from '@/api/fetchers/book-club.fetchers';
import { Role } from '@/db/models/nodes';

// Page props
interface BookClubAdminPickOrderPageProps {
  params: {
    bookClubSlug: string;
  };
}

/**
 * Async component for fetching and displaying the pick order
 *
 * @param {Object} props - Component props
 * @param {string} props.bookClubSlug - The slug of the book club
 */
const PickOrderWrapper = async ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => {
  // Fetch the pick order
  const pickOrder = await getBookClubPickList(bookClubSlug);
  const memberRole = await getBookClubRole(bookClubSlug);

  return (
    <BookClubPickOrderList
      pickOrder={pickOrder}
      bookClubSlug={bookClubSlug}
      memberRole={memberRole as Role}
      inAdminPage
    />
  );
};

/**
 * Book club admin sub-page for displaying and managing the pick order
 *
 * @param {Object} props Component props
 * @param {Object} props.params The parameters of the page
 * @param {string} props.params.bookClubSlug The slug of the book club
 */
const BookClubAdminPickOrderPage = ({
  params: { bookClubSlug }
}: Readonly<BookClubAdminPickOrderPageProps>) => (
  <Suspense
    fallback={
      <div className="flex justify-center items-center w-full h-36">
        <Spinner />
      </div>
    }
  >
    <PickOrderWrapper bookClubSlug={bookClubSlug} />
  </Suspense>
);

export default BookClubAdminPickOrderPage;
