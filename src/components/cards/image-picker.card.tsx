'use client';

import { useEffect, useState } from 'react';
import { Card } from '@nextui-org/card';
import { Image } from '@nextui-org/image';

import { getPreSignedBookClubImageURL } from '@/api/fetchers/s3.fetchers';

// Component props
interface BookClubImagePickerCardProps {
  imageName: string;
  selected: boolean;
  setSelectedImage: (imageName: string) => void;
}

/**
 * Selectable image for book clubs
 *
 * @param {Object} props - The component props
 * @param {string} props.imageName - The file name of the image
 * @param {boolean} props.selected - Whether or not the image is selected
 * @param {Function} props.setSelectedImage - Function to set the selected image
 */
const BookClubImagePickerCard = ({
                                   imageName,
                                   selected,
                                   setSelectedImage
                                 }: Readonly<BookClubImagePickerCardProps>) => {
  const [ url, setURL ] = useState<string>('');

  // Handler for image selection
  const handleClick = () => setSelectedImage(imageName);

  // On load, get the pre-signed URL for the image
  // TODO - It would be nice to find a more best-practice Next.js way to do this
  useEffect(() => {
    const getBookClubImage = async () => {
      const fetchedURL = await getPreSignedBookClubImageURL(imageName);
      setURL(fetchedURL);
    };

    if (!imageName || imageName === 'default') setURL('/images/books.jpg');
    else getBookClubImage();
  }, [ imageName ]);

  return (
    <Card
      radius="sm"
      className={ `cursor-pointer ${
        selected ? 'border-5 border-green-700 p-1' : 'border-none'
      }` }
      onClick={ handleClick }
    >
      { url && (
        <Image
          src={ url }
          alt={ imageName }
          className="w-full h-auto"
          width="250"
          height="250"
          onClick={ handleClick }
        />
      ) }
    </Card>
  );
};

export default BookClubImagePickerCard;
