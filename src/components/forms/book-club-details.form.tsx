'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';
import { Divider } from '@nextui-org/divider';
import { Radio, RadioGroup } from '@nextui-org/radio';

import BookClubImagePickerModal from '@/components/modals/book-club-image-picker.modal';
import SubmitButton from '@/components/buttons/submit.button';
import BookClubCard from '@/components/cards/book-club.card';
import {
  handleCreateBookClub,
  handleUpdateBookClub
} from '@/api/form-handlers/book-club-form.handlers';
import { ErrorFormState } from '@/api/form-handlers/state-interfaces';
import { BookClubProperties, Publicity } from '@/db/models/nodes';

// Interface for form values
interface FormValues {
  name: string;
  description: string;
  imageName: string;
  publicity: Publicity;
}

/**
 * Form for creating or updating a book club's details
 *
 * @prop {Object} props - The component props
 * @prop {BookClubProperties} props.bookClub - The book club to edit
 */
const BookClubDetailsForm = ({
  bookClub
}: Readonly<{ bookClub?: BookClubProperties }>) => {
  // Form state
  const [formState, formAction] = useFormState(
    !!bookClub ? handleUpdateBookClub : handleCreateBookClub,
    {
      error: ''
    } as ErrorFormState
  );

  // State for input fields
  const [formData, setFormData] = useState<FormValues>(
    bookClub
      ? {
          name: bookClub.name,
          description: bookClub.description,
          imageName: bookClub.image,
          publicity: bookClub.publicity
        }
      : {
          name: '',
          description: '',
          imageName: 'default',
          publicity: Publicity.PRIVATE
        }
  );

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
    formData.imageName.length &&
    !formData.name.includes('/') &&
    formData.name !== '-' &&
    (!bookClub ||
      formData.name !== bookClub.name ||
      formData.description !== bookClub.description ||
      formData.imageName !== bookClub.image ||
      formData.publicity !== bookClub.publicity);

  return (
    <form action={formAction}>
      <div className="space-y-2">
        {formState.error && <p className="text-red-500">* {formState.error}</p>}
        {formData.name.includes('/') && (
          <p className="text-red-500">* Name cannot include a slash</p>
        )}
        <Input
          className="hidden"
          name="previousSlug"
          value={bookClub?.slug}
        />
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
          <Radio value={Publicity.PRIVATE}>Private</Radio>
        </RadioGroup>
        <SubmitButton
          buttonText={bookClub ? 'Update' : 'Create'}
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
            publicity: formData.publicity,
            isActive: true,
            created: new Date()
          }}
        />
      </div>
    </form>
  );
};

export default BookClubDetailsForm;
