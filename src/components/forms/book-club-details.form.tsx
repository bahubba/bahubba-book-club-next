'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';
import { Divider } from '@nextui-org/divider';
import { Radio, RadioGroup } from '@nextui-org/radio';

import BookClubImagePickerModal from '@/components/modals/book-club-image-picker.modal';
import SubmitButton from '@/components/buttons/submit.button';
import BookClubCard from '@/components/cards/book-club.card';
import { handleSubmitNewBookClub } from '@/api/form-handlers/book-club-form.handlers';
import { Publicity } from '@/db/models/book-club.models';
import { ErrorFormState } from '@/api/form-handlers/state-interfaces';
import { ImageProps } from '@/components/interfaces';

// Interface for form values
interface FormValues {
  name: string;
  description: string;
  imageName: string;
  publicity: Publicity;
}

/** Form for creating or updating a book club's details */
const BookClubDetailsForm = () => {
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
  const [selectedImageURL, setSelectedImageURL] = useState<string>('');

  // Handler for form data changes
  const handleInputChange = ({
    target: { name, value }
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [name]: value });

  // Handler for image selection
  const setSelectedImage = ({ imageName, imageURL }: ImageProps) => {
    setFormData({ ...formData, imageName });
    setSelectedImageURL(imageURL);
  };

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
            image: selectedImageURL,
            publicity: formData.publicity
          }}
        />
      </div>
    </form>
  );
};

export default BookClubDetailsForm;
