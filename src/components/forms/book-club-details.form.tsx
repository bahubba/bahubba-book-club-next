'use client';

import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';
import { Radio, RadioGroup } from '@nextui-org/radio';
import { Button } from '@nextui-org/button';

import { handleSubmitNewBookClub } from '@/api/form-handlers/book-club-form.handlers';
import { Publicity } from '@/db/models/book-club.models';
import { ErrorFormState } from '@/api/form-handlers/state-interfaces';

/** Form for creating or updating a book club's details */
const BookClubDetailsForm = () => {
  // Form state
  const [formState, formAction] = useFormState(handleSubmitNewBookClub, {
    error: ''
  } as ErrorFormState);

  return (
    <form action={formAction}>
      <div className="space-y-2">
        {formState.error && <p className="text-red-500">* {formState.error}</p>}
        <Input
          variant="bordered"
          label="Name"
          name="name"
          required
        />
        <Input
          variant="bordered"
          label="Description"
          name="description"
          required
        />
        <Input
          variant="bordered"
          label="Image"
          name="image"
        />
        <RadioGroup
          label="Publicity"
          orientation="horizontal"
          defaultValue={Publicity.PRIVATE}
          name="publicity"
        >
          <Radio value={Publicity.PUBLIC}>Public</Radio>
          <Radio value={Publicity.OBSERVABLE}>Observable</Radio>
          <Radio value={Publicity.PRIVATE}>Private</Radio>
        </RadioGroup>
        <Button
          type="submit"
          color="secondary"
        >
          Create
        </Button>
      </div>
    </form>
  );
};

export default BookClubDetailsForm;
