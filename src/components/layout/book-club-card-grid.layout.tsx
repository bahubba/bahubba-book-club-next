import BookClubCard from '@/components/cards/book-club.card';
import { BookClubProperties } from '@/db/models/nodes';

// Component props
interface BookClubGridLayoutProps {
  cols?:
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | '11'
    | '12';
  bookClubs: BookClubProperties[];
}

/**
 * Grid layout for displaying book club cards
 *
 * @param { BookClubGridLayoutProps } props - Component props
 * @param { number } props.cols - Number of columns to display
 * @param { BookClubProperties[] } props.bookClubs - Book clubs to display
 */
const BookClubCardGridLayout = ({
                                  cols = '3',
                                  bookClubs
                                }: Readonly<BookClubGridLayoutProps>) => (
  <div className={ `grid grid-cols-${ cols } gap-1 p-2` }>
    { bookClubs.map(bookClub => (
      <BookClubCard
        key={ bookClub.slug }
        bookClub={ bookClub }
      />
    )) }
  </div>
);

export default BookClubCardGridLayout;
