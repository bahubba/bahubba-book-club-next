'use client';

import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';

import SubmitButton from '../buttons/submit.button';

/**
 * Form for requesting membership in a book club
 *
 * @prop {Object} props Component props
 * @prop {string} props.bookClubSlug The slug of the book club
 */
const RequestMembershipForm = ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => {
  // Form state
  // const [formState, formAction] = useFormState(handleRequestMembership, {
  //   error: ''
  // });

  return (
    <form>
      <div className="space-y-2">
        <Input
          variant="bordered"
          label="Request message"
          name="requestMessage"
          placeholder="Enter a message to the book club admin"
        />
        <SubmitButton buttonText="Submit" />
      </div>
    </form>
  );
};

export default RequestMembershipForm;
