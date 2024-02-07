import { Suspense } from 'react';
import { Spinner } from '@nextui-org/spinner';

import BookClubDetailsForm from '@/components/forms/book-club-details.form';
import { getBookClub } from '@/api/fetchers/book-club.fetchers';

// Page props
interface BookClubAdminDetailsPageProps {
  params: {
    bookClubSlug: string;
  };
}

/**
 * Async component for rendering the admin details form after fetching data
 *
 * @prop {Object} props - The component props
 * @prop {string} props.bookClubSlug The slug of the book club
 */
const BookClubDetailsFormWrapper = async ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => {
  const bookClub = await getBookClub(bookClubSlug);

  return bookClub ? (
    <BookClubDetailsForm bookClub={bookClub} />
  ) : (
    // TODO - Add a 404 page
    <span>No book club found</span>
  );
};

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
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center w-full h-96">
          <Spinner />
        </div>
      }
    >
      <BookClubDetailsFormWrapper bookClubSlug={bookClubSlug} />
    </Suspense>
  );
};

export default BookClubAdminDetailsPage;
