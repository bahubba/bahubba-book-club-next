import Link from 'next/link';

// Component props
interface BookClubBackButtonProps {
  bookClubSlug: string;
}

/**
 * Button for navigating back to the book club home page
 *
 * @param {Object} props Component props
 * @param {Object} props.bookClubSlug The unique slug for the book club
 */
const BookClubBackButton = ({ bookClubSlug }: BookClubBackButtonProps) => (
  <Link href={`/book-club/${bookClubSlug}`}>
    <span className="underline font-bold text-primary-700">&lt;&lt; Back</span>
  </Link>
);

export default BookClubBackButton;