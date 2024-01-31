'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tooltip } from '@nextui-org/tooltip';
import { Card, CardBody, CardHeader } from '@nextui-org/card';

import { getPreSignedBookClubImageURL } from '@/api/fetchers/s3.fetchers';
import { BookClubDoc } from '@/db/models/book-club.models';

/**
 * Card display component for book clubs
 *
 * @param {BookClubDoc} bookClub - Book club
 */
const BookClubCard = ({ bookClub }: { bookClub: BookClubDoc }) => {
  // State for the pre-signed image URL
  const [url, setURL] = useState<string>('');

  // On load, get the pre-signed URL for the image
  // TODO - It would be nice to find a more best-practice Next.js way to do this
  useEffect(() => {
    const getBookClubImage = async () => {
      const fetchedURL = await getPreSignedBookClubImageURL(bookClub.image);
      setURL(fetchedURL);
    };

    if (!bookClub.image || bookClub.image === 'default')
      setURL('/images/books.jpg');
    else getBookClubImage();
  }, [bookClub.image]);

  return (
    // TODO - Get the image from S3
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
              src={url}
              alt="Books"
              height={200}
              width={200}
            />
          </CardBody>
        </Card>
      </Tooltip>
    </Link>
  );
};

export default BookClubCard;
