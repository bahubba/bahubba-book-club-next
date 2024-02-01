import BookClubDetailsForm from '@/components/forms/book-club-details.form';

// Page props
interface BookClubAdminDetailsPageProps {
  params: {
    bookClubSlug: string;
  };
}

/** Book club details admin page */
const BookClubAdminDetailsPage = ({
  params: { bookClubSlug }
}: Readonly<BookClubAdminDetailsPageProps>) => {
  return <BookClubDetailsForm bookClubSlug={bookClubSlug} />;
};

export default BookClubAdminDetailsPage;
