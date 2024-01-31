import BookClubDetailsForm from '@/components/forms/book-club-details.form';

// Page props
interface BookClubAdminDetailsPageProps {
  params: {
    bookClubNameSlug: string;
  };
}

/** Book club details admin page */
const BookClubAdminDetailsPage = ({
  params: { bookClubNameSlug }
}: Readonly<BookClubAdminDetailsPageProps>) => {
  console.log('bookClubNameSlug:', bookClubNameSlug); // DELETEME
  return <BookClubDetailsForm bookClubName={bookClubNameSlug} />;
};

export default BookClubAdminDetailsPage;
