import { Image } from '@nextui-org/image';

import { GoogleAPIBook } from '@/api/fetchers/book.fetchers';

/**
 * List item for a book
 *
 * @param {Object} props
 * @param {Object} props.book Details about the book
 */
const BookListItem = ({ book }: Readonly<{ book: GoogleAPIBook }>) => (
  <div className="flex gap-x-2">
    <div className="flex-shrink flex items-center">
      <Image
        src={book.thumbnail}
        alt={`${book.title} cover`}
      />
    </div>
    <div className="flex-1 flex flex-col gap-y-2">
      <h3>{book.title}</h3>
      <small>{book.description}</small>
    </div>
  </div>
);

export default BookListItem;