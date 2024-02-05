import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';
import { Tooltip } from '@nextui-org/tooltip';

import SubmitButton from './submit.button';
import { handleRemoveMember } from '@/api/form-handlers/membership-form.handlers';
import RejectIcon from '../icons/reject.icon';

// Component props
interface RemoveMemberButtonProps {
  bookClubSlug: string;
  userEmail: string;
}

/**
 * Button (and form) for approving or rejecting a membership request
 *
 * @param {Object} props - The component's props
 * @param {string} props.bookClubSlug - The slug of the book club
 * @param {userEmail} props.email - The email of the user requesting membership
 */
const RemoveMemberButton = ({
  bookClubSlug,
  userEmail
}: Readonly<RemoveMemberButtonProps>) => {
  // Form state
  const [formState, formAction] = useFormState(handleRemoveMember, {
    error: ''
  });

  return (
    <Tooltip
      className="bg-opacity-75 bg-black text-white"
      content="Remove member"
    >
      <form action={formAction}>
        <Input
          className="hidden"
          name="slug"
          value={bookClubSlug}
        />
        <Input
          className="hidden"
          name="userEmail"
          value={userEmail}
        />
        <SubmitButton
          color="danger"
          buttonIcon={<RejectIcon />}
        />
      </form>
    </Tooltip>
  );
};

export default RemoveMemberButton;
