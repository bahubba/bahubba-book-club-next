'use client';

import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';
import { Textarea } from '@nextui-org/react';

import SubmitButton from '@/components/buttons/submit.button';
import { handleCreateAdHocDiscussion } from '@/api/form-handlers/discussion-form.handlers';

/**
 * Form for creating a new discussion in a book club
 *
 * @param {string} bookClubSlug - The slug of the book club
 */
export const DiscussionForm = ({
                                 bookClubSlug
                               }: Readonly<{ bookClubSlug: string }>) => {
  const [ formState, formAction ] = useFormState(handleCreateAdHocDiscussion, {
    error: ''
  });

  return (
    <form action={ formAction }>
      <div className="space-y-2">
        <Input
          className="hidden"
          name="slug"
          value={ bookClubSlug }
        />
        <Input
          variant="bordered"
          label="Title"
          name="title"
          type="text"
          required
          isRequired
        />
        <Textarea
          variant="bordered"
          label="Description"
          name="description"
          type="textbox"
          required
          isRequired
        />
        <SubmitButton buttonText="Create" />
      </div>
    </form>
  );
};

export default DiscussionForm;
