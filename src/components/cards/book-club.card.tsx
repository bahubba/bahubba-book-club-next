import Image from 'next/image';
import { Card, CardBody, CardHeader } from '@nextui-org/card';

import { BookClubDoc } from '@/db/models/book-club.models';
import { Tooltip } from '@nextui-org/tooltip';
import Link from 'next/link';

/**
 * Card display component for book clubs
 *
 * @param {BookClubDoc} bookClub - Book club
 */
const BookClubCard = ({ bookClub }: { bookClub: BookClubDoc }) => (
  <Link href={`/book-club/${bookClub.name.toLowerCase()}`}>
    <Tooltip
      className="bg-opacity-75 bg-black text-white"
      showArrow
      content={bookClub.description}
    >
      <Card>
        <CardHeader className="pb-0 flex-col items-start">
          <h1>{bookClub.name}</h1>
          <small className="overflow-hidden line-clamp-1">
            {bookClub.description}
          </small>
        </CardHeader>
        <CardBody className="overflow-visible">
          <Image
            className="object-cover rounded-xl"
            src="/images/books.jpg"
            alt="Books"
            height={200}
            width={200}
          />
        </CardBody>
      </Card>
    </Tooltip>
  </Link>
);

export default BookClubCard;
