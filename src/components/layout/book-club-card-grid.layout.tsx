import BookClubCard from '@/components/cards/book-club.card';
import { BookClubDoc } from '@/db/models/book-club.models';

// Component props
interface BookClubGridLayoutProps {
  cols?: number;
  bookClubs: BookClubDoc[];
}

/**
 * Grid layout for displaying book club cards
 *
 * @param { BookClubGridLayoutProps } props - Component props
 * @param { number } props.cols - Number of columns to display
 * @param { BookClubDoc[] } props.bookClubs - Book clubs to display
 */
const BookClubCardGridLayout = ({
  cols = 3,
  bookClubs
}: Readonly<BookClubGridLayoutProps>) => (
  <div className={`grid grid-cols-${cols} gap-1 p-2`}>
    {bookClubs.map(bookClub => (
      <BookClubCard
        key={bookClub._id}
        bookClub={bookClub}
      />
    ))}
  </div>
);

export default BookClubCardGridLayout;
