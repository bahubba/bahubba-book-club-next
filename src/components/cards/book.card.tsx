import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Image } from '@nextui-org/image';

import { GoogleAPIBook } from '@/api/fetchers/book.fetchers';

/**
 * Card display for books
 *
 * @param {Object} props
 * @param {Object} props.book Details about the book
 */
const BookCard = ({ book }: { book: GoogleAPIBook }) => (
  <Card className="max-w-[200px]">
    <CardHeader className="pb-0 flex-col items-start">
      <h3>{book.title}</h3>
    </CardHeader>
    <CardBody className="overflow-visible p-1 m-0">
      <div className="flex justify-center">
        <Image
          className="object-cover rounded-xl"
          src={book.thumbnail}
          alt={`${book.title} cover`}
        />
      </div>
    </CardBody>
  </Card>
);

export default BookCard;