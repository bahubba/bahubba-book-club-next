import BookClubDetailsForm from '@/components/forms/book-club-details.form';

// Page props
interface BookClubAdminDetailsPageProps {
  params: {
    bookClubSlug: string;
  };
}

/**
 * Book club details admin page
 *
 * @prop {Object} props - The page props
 * @prop {BookClubAdminDetailsPageProps} props.params - The page params
 * @prop {string} props.params.bookClubSlug - The book club slug from the URL path
 */
const BookClubAdminDetailsPage = ({
  params: { bookClubSlug }
}: Readonly<BookClubAdminDetailsPageProps>) => {
  return <BookClubDetailsForm bookClubSlug={bookClubSlug} />;
};

export default BookClubAdminDetailsPage;
