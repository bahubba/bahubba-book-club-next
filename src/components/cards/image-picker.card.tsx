'use client';

import { useEffect, useState } from 'react';
import Image from 'next/Image';
import { Card } from '@nextui-org/card';

import { getPreSignedBookClubImageURL } from '@/api/fetchers/s3.fetchers';

/**
 * Selectable image for book clubs
 *
 * @param {Object} props - The component props
 * @param {string} props.fileName - The file name of the image
 */
const BookClubImagePickerCard = ({
  fileName
}: Readonly<{ fileName: string }>) => {
  const [url, setURL] = useState<string>('');

  useEffect(() => {
    const getBookClubImage = async () => {
      const fetchedURL = await getPreSignedBookClubImageURL(fileName);
      setURL(fetchedURL);
    };

    fileName && getBookClubImage();
  }, [fileName]);

  return (
    <>
      {url && (
        <Image
          src={url}
          alt={fileName}
          className="w-full h-auto"
          width="250"
          height="250"
        />
      )}
    </>
  );
};

export default BookClubImagePickerCard;
