import { getBookClubName } from '@/api/fetchers/book-club.fetchers';

// Component props
interface BookClubHeaderProps {
  bookClubSlug: string;
  prefix?: string;
  suffix?: string;
}

/**
 * Async component for displaying the book club name
 *
 * @param {Object} props - The component props
 * @param {string} props.bookClubSlug - The slug of the book club
 */
const BookClubHeader = async ({ bookClubSlug, prefix, suffix }: Readonly<BookClubHeaderProps>) => {
  // Fetch the book club name
  const bookClubName = await getBookClubName(bookClubSlug);

  return <>{`${prefix ?? ''}${bookClubName}${suffix ?? ''}`}</>;
};

export default BookClubHeader;