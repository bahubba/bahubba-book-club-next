'use client';

import { useEffect, useState } from 'react';
import { Card } from '@nextui-org/card';
import { Image } from '@nextui-org/image';

import { getPreSignedBookClubImageURL } from '@/api/fetchers/s3.fetchers';
import { ImageProps } from '@/components/interfaces';

// Component props
interface BookClubImagePickerCardProps {
  fileName: string;
  selected: boolean;
  setSelectedImage: (imageProps: ImageProps) => void;
}

/**
 * Selectable image for book clubs
 *
 * @param {Object} props - The component props
 * @param {string} props.fileName - The file name of the image
 * @param {boolean} props.selected - Whether or not the image is selected
 * @param {Function} props.setSelectedImage - Function to set the selected image
 */
const BookClubImagePickerCard = ({
  fileName,
  selected,
  setSelectedImage
}: Readonly<BookClubImagePickerCardProps>) => {
  const [url, setURL] = useState<string>('');

  // Handler for image selection
  const handleClick = () =>
    setSelectedImage({ imageName: fileName, imageURL: url });

  // On load, get the pre-signed URL for the image
  // TODO - It would be nice to find a more best-practice Next.js way to do this
  useEffect(() => {
    const getBookClubImage = async () => {
      const fetchedURL = await getPreSignedBookClubImageURL(fileName);
      setURL(fetchedURL);
    };

    fileName && fileName !== 'default' && getBookClubImage();
  }, [fileName]);

  return (
    <Card
      radius="sm"
      className={`cursor-pointer ${
        selected ? 'border-5 border-green-700 p-1' : 'border-none'
      }`}
      onClick={handleClick}
    >
      {url && (
        <Image
          src={fileName === 'default' ? '/images/books.jpg' : url}
          alt={fileName}
          className="w-full h-auto"
          width="250"
          height="250"
          onClick={handleClick}
        />
      )}
    </Card>
  );
};

export default BookClubImagePickerCard;
