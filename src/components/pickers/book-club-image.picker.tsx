'use client';

import { useEffect, useState } from 'react';
import { getStockBookClubImageNames } from '@/api/fetchers/s3.fetchers';
import BookClubImagePickerCard from '../cards/image-picker.card';
import { ImageProps } from '@/components/interfaces';

// Component props
interface BookClubImagePickerProps {
  selectedImage: string;
  setSelectedImage: (imageProps: ImageProps) => void;
}

/** Async function for getting a list of selectable images */
const fetchBookClubImagePickerCards = async () =>
  await getStockBookClubImageNames();

/**
 * Picker to choose from a list of stock images for book clubs
 *
 * @param {Object} props - Component props
 * @param {string} props.selectedImage - Currently selected image
 * @param {Function} props.setSelectedImage - Function to set the selected image
 */
const BookClubImagePicker = ({
  selectedImage,
  setSelectedImage
}: Readonly<BookClubImagePickerProps>) => {
  const [imageFileNames, setImageFileNames] = useState<string[]>([]);

  // On load, get the list of stock images
  // TODO - It would be nice to find a more best-practice Next.js way to do this
  useEffect(() => {
    const getBookClubImagePickerCards = async () => {
      const fetchedFileNames = await fetchBookClubImagePickerCards();
      setImageFileNames(fetchedFileNames);
    };

    getBookClubImagePickerCards();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2">
      <BookClubImagePickerCard
        key="default"
        fileName="default"
        selected={selectedImage === 'default'}
        setSelectedImage={setSelectedImage}
      />
      {imageFileNames.map((fileName, index) => (
        <BookClubImagePickerCard
          key={index}
          fileName={fileName}
          selected={selectedImage === fileName}
          setSelectedImage={setSelectedImage}
        />
      ))}
    </div>
  );
};

export default BookClubImagePicker;
