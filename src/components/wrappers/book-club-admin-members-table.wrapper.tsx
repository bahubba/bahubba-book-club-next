'use server';

import BookClubAdminMembersTable from '@/components/tables/book-club-admin-members.table';
import { getMembersBySlug } from '@/api/fetchers/book-club.fetchers';

/**
 * Wrapper for the BookClubAdminMembersTable component
 * Only necessary because NextUI Table component does not support SSR
 * See here: https://github.com/nextui-org/nextui/issues/1619#issuecomment-1678863519
 *
 * @prop {Object} props Component props
 * @prop {string} props.bookClubSlug The slug of the book club
 */
const BookClubAdminMembersTableWrapper = async ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => {
  // Fetch the members of the book club
  const members = await getMembersBySlug(bookClubSlug);

  return <BookClubAdminMembersTable members={members} />;
};

export default BookClubAdminMembersTableWrapper;
