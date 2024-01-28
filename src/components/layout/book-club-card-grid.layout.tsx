import BookClubCard from '@/components/cards/book-club.card';
import { BookClubDoc } from '@/db/models/book-club.models';

/**
 * Grid layout for displaying book club cards
 *
 * @param { BookClubDoc[] } bookClubs - Book clubs to display
 */
const BookClubCardGridLayout = ({ bookClubs }: { bookClubs: BookClubDoc[] }) => {
  return (
    <div className={ `grid grid-cols-${ 3 } gap-1 px-2 pt-2` }>
      {
        bookClubs.map(bookClub => (
          <BookClubCard key={ bookClub._id } bookClub={ bookClub }/>
        ))
      }
    </div>
  );
};

export default BookClubCardGridLayout;