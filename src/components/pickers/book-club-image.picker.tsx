'use client';

import { useEffect, useState } from 'react';
import { getStockBookClubImageNames } from '@/api/fetchers/s3.fetchers';
import BookClubImagePickerCard from '../cards/image-picker.card';

/** Async function for getting a list of selectable images */
const fetchBookClubImagePickerCards = async () => {
  return await getStockBookClubImageNames();
};

/** Picker to choose from a list of stock images for book clubs */
const BookClubImagePicker = () => {
  const [imageFileNames, setImageFileNames] = useState<string[]>([]);

  useEffect(() => {
    const getBookClubImagePickerCards = async () => {
      const fetchedFileNames = await fetchBookClubImagePickerCards();
      setImageFileNames(fetchedFileNames);
    };

    getBookClubImagePickerCards();
  }, []);

  return (
    <div className="grid grid-cols-3">
      {imageFileNames.map((fileName, index) => (
        <BookClubImagePickerCard
          key={index}
          fileName={fileName}
        />
      ))}
    </div>
  );
};

export default BookClubImagePicker;
