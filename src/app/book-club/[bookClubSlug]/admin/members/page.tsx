import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { Spinner } from '@nextui-org/spinner';

import BookClubAdminMembersTable from '@/components/tables/book-club-admin-members.table';
import {
  getBookClubRole,
  getMembersBySlug
} from '@/api/fetchers/book-club.fetchers';
import { Role } from '@/db/models/book-club.models';

// Page props
interface BookClubAdminMembersPageProps {
  params: {
    bookClubSlug: string;
  };
}

/**
 * Async component for rendering the admin member's table after fetching data
 *
 * @prop {Object} props - The component props
 * @prop {string} props.bookClubSlug The slug of the book club
 */
const BookClubAdminMembersTableWrapper = async ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => {
  // Get the session and the admin's email
  const session = await getServerSession();

  // Fetch the members and the current user's role
  const adminRole = await getBookClubRole(bookClubSlug);
  const members = await getMembersBySlug(bookClubSlug);

  return (
    <BookClubAdminMembersTable
      bookClubSlug={bookClubSlug}
      adminEmail={session?.user?.email ?? ''}
      adminRole={adminRole as Role}
      members={members}
    />
  );
};

/**
 * Page for managing members of a book club
 *
 * @prop {Object} props Component props
 * @prop {Object} props.params The parameters of the page
 * @prop {string} props.params.bookClubSlug The slug of the book club
 */
const BookClubAdminMembersPage = ({
  params: { bookClubSlug }
}: Readonly<BookClubAdminMembersPageProps>) => (
  <Suspense
    fallback={
      <div className="flex justify-center items-center w-full h-36">
        <Spinner />
      </div>
    }
  >
    <BookClubAdminMembersTableWrapper bookClubSlug={bookClubSlug} />
  </Suspense>
);

export default BookClubAdminMembersPage;
