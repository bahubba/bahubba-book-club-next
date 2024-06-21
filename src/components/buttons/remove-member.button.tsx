import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';
import { Tooltip } from '@nextui-org/tooltip';

import SubmitButton from './submit.button';
import { handleRemoveMember } from '@/api/form-handlers/membership-form.handlers';
import RejectIcon from '../icons/reject.icon';
import { Role } from '@/db/models/nodes';

// Component props
interface RemoveMemberButtonProps {
  bookClubSlug: string;
  adminEmail: string;
  adminRole: Role;
  userEmail: string;
  memberRole: Role;
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
  adminEmail,
  adminRole,
  userEmail,
  memberRole
}: Readonly<RemoveMemberButtonProps>) => {
  // Form state
  const [formState, formAction] = useFormState(handleRemoveMember, {
    error: ''
  });

  // Logic for when the button should be disabled
  const isDisabled =
    memberRole === Role.OWNER ||
    (memberRole === Role.ADMIN &&
      adminEmail !== userEmail &&
      adminRole !== Role.OWNER);

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
          color={isDisabled ? 'default' : 'danger'}
          buttonIcon={<RejectIcon color={isDisabled ? 'black' : 'secondary'} />}
          disabled={isDisabled}
        />
      </form>
    </Tooltip>
  );
};

export default RemoveMemberButton;
