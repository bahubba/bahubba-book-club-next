'use client';

import { Image } from '@nextui-org/image';

import { GoogleAPIBook } from '@/api/fetchers/book.fetchers';

// Component props
interface BookListItemProps {
  book: GoogleAPIBook;
  pickable?: boolean;
  bookClubSlug?: string;
}

/**
 * List item for a book
 *
 * @param {Object} props
 * @param {Object} props.book Details about the book
 * @param {boolean} props.pickable Whether the book can be picked
 * @param {string} props.bookClubSlug If pickable, the slug of the book club being picked for
 */
const BookListItem = ({
  book,
  pickable = false,
  bookClubSlug
}: Readonly<BookListItemProps>) => (
  <div
    className={
      'flex p-2 gap-x-2 rounded-2xl ' +
      `${pickable && !!bookClubSlug && bookClubSlug.length > 0 ? 'cursor-pointer hover:bg-secondary-50' : ''}`
    }
    onClick={(e) => console.log('foooooooo')}
  >
    <div className="flex-shrink flex items-center">
      <Image
        src={book.thumbnail}
        alt={`${book.title} cover`}
      />
    </div>
    <div className="flex-1 flex flex-col gap-y-2">
      <h3>{book.title}</h3>
      <small className="overflow-hidden line-clamp-5">{book.description}</small>
    </div>
  </div>
);

export default BookListItem;