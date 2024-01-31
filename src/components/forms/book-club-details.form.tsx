'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';
import { Divider } from '@nextui-org/divider';
import { Radio, RadioGroup } from '@nextui-org/radio';

import BookClubImagePickerModal from '@/components/modals/book-club-image-picker.modal';
import SubmitButton from '@/components/buttons/submit.button';
import BookClubCard from '@/components/cards/book-club.card';
import { handleSubmitNewBookClub } from '@/api/form-handlers/book-club-form.handlers';
import { BookClubDoc, Publicity } from '@/db/models/book-club.models';
import { ErrorFormState } from '@/api/form-handlers/state-interfaces';
import { getBookClubByName } from '@/api/fetchers/book-club.fetchers';

// Interface for form values
interface FormValues {
  name: string;
  description: string;
  imageName: string;
  publicity: Publicity;
}

/** Async function for getting the book club */
const fetchBookClub = async (
  bookClubName: string
): Promise<BookClubDoc | null> => await getBookClubByName(bookClubName);

/** Form for creating or updating a book club's details */
const BookClubDetailsForm = ({
  bookClubName
}: Readonly<{ bookClubName?: string }>) => {
  console.log('inner bookClubName:', bookClubName); // DELETEME

  // Form state
  const [formState, formAction] = useFormState(handleSubmitNewBookClub, {
    error: ''
  } as ErrorFormState);

  // State for selected image
  const [formData, setFormData] = useState<FormValues>({
    name: '',
    description: '',
    imageName: 'default',
    publicity: Publicity.PRIVATE
  });

  // Fetch book club if editing
  useEffect(() => {
    const fetchEditBookClub = async (bookClubName: string) => {
      const bookClub = await fetchBookClub(bookClubName);
      console.log('fetching', bookClub); // DELETEME
      if (!!bookClub)
        setFormData({
          name: bookClub.name,
          description: bookClub.description,
          imageName: bookClub.image,
          publicity: bookClub.publicity
        });
    };

    if (!!bookClubName && bookClubName.length) fetchEditBookClub(bookClubName);
  }, [bookClubName]);

  // Handler for form data changes
  const handleInputChange = ({
    target: { name, value }
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [name]: value });

  // Handler for image selection
  const setSelectedImage = (imageName: string) =>
    setFormData({ ...formData, imageName });

  // Helper function to determine if the form is submittable
  const canSubmit = () =>
    formData.name.length &&
    formData.description.length &&
    formData.imageName.length;

  return (
    <form action={formAction}>
      <div className="space-y-2">
        {formState.error && <p className="text-red-500">* {formState.error}</p>}
        <Input
          variant="bordered"
          label="Name"
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
        />
        <Input
          variant="bordered"
          label="Description"
          name="description"
          required
          value={formData.description}
          onChange={handleInputChange}
        />
        <Input
          className="hidden"
          variant="bordered"
          label="Image"
          name="image"
          value={formData.imageName}
          required
        />
        <BookClubImagePickerModal
          selectedImage={formData.imageName}
          setSelectedImage={setSelectedImage}
        />
        <RadioGroup
          label="Publicity"
          orientation="horizontal"
          defaultValue={Publicity.PRIVATE}
          name="publicity"
          value={formData.publicity}
          onChange={handleInputChange}
        >
          <Radio value={Publicity.PUBLIC}>Public</Radio>
          <Radio value={Publicity.OBSERVABLE}>Observable</Radio>
          <Radio value={Publicity.PRIVATE}>Private</Radio>
        </RadioGroup>
        <SubmitButton
          buttonText="Create"
          disabled={!canSubmit()}
        />
      </div>
      <Divider className="my-2" />
      <h1 className="text-large">Preview</h1>
      <div className="flex justify-center">
        <BookClubCard
          bookClub={{
            name: formData.name,
            description: formData.description,
            image: formData.imageName,
            publicity: formData.publicity
          }}
        />
      </div>
    </form>
  );
};

export default BookClubDetailsForm;
