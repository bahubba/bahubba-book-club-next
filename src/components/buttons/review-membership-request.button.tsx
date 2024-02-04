import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';
import { Tooltip } from '@nextui-org/tooltip';

import SubmitButton from './submit.button';
import { handleReviewMembershipRequest } from '@/api/form-handlers/membership-request-form.handlers';
import { BookClubMembershipRequestStatus } from '@/db/models/membership-request.models';
import RejectIcon from '../icons/reject.icon';
import ApproveIcon from '../icons/approve.icon';

// Component props
interface ReviewMembershipRequestButtonProps {
  bookClubSlug: string;
  userEmail: string;
  isRejecting?: boolean;
}

/**
 * Button (and form) for approving or rejecting a membership request
 *
 * @param {Object} props - The component's props
 * @param {string} props.bookClubSlug - The slug of the book club
 * @param {userEmail} props.email - The email of the user requesting membership
 * @param {boolean} props.isRejecting
 */
const ReviewMembershipRequestButton = ({
  bookClubSlug,
  userEmail,
  isRejecting = false
}: Readonly<ReviewMembershipRequestButtonProps>) => {
  // Form state
  const [formState, formAction] = useFormState(handleReviewMembershipRequest, {
    error: ''
  });

  return (
    <Tooltip
      className="bg-opacity-75 bg-black text-white"
      content={
        isRejecting ? 'Reject membership' : 'Approve membership as Reader'
      }
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
        <Input
          className="hidden"
          name="status"
          value={
            isRejecting
              ? BookClubMembershipRequestStatus.REJECTED
              : BookClubMembershipRequestStatus.ACCEPTED
          }
        />
        <SubmitButton
          color={isRejecting ? 'danger' : 'primary'}
          buttonIcon={
            isRejecting ? <RejectIcon /> : <ApproveIcon color="secondary" />
          }
        />
      </form>
    </Tooltip>
  );
};

export default ReviewMembershipRequestButton;
