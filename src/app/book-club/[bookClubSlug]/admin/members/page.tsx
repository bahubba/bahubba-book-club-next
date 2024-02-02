import BookClubAdminMembersTableWrapper from '@/components/wrappers/book-club-admin-members-table.wrapper';

// Page props
interface BookClubAdminMembersPageProps {
  params: {
    bookClubSlug: string;
  };
}

/**
 * Page for managing members of a book club
 *
 * @prop {Object} props Component props
 * @prop {Object} props.params The parameters of the page
 * @prop {string} props.params.bookClubSlug The slug of the book club
 */
const BookClubAdminMembersPage = ({
  params: { bookClubSlug }
}: Readonly<BookClubAdminMembersPageProps>) => {
  return <BookClubAdminMembersTableWrapper bookClubSlug={bookClubSlug} />;
};

export default BookClubAdminMembersPage;
