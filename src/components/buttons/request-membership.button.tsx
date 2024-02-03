import Link from 'next/link';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';

import AddMemberIcon from '../icons/add-member.icon';

/**
 * Button linking to the request membership page for a book club
 *
 * @prop {Object} props - The component's props
 * @prop {string} props.bookClubSlug - The slug of the book club
 */
const RequestMembershipButton = ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => (
  <Tooltip
    className="bg-opacity-75 bg-black text-white"
    content="Request membersrhip"
  >
    <Link href={`/book-club/${bookClubSlug}/request-membership`}>
      <Button
        isIconOnly
        size="sm"
        color="secondary"
        aria-label={`Request membership to ${bookClubSlug}`}
      >
        <AddMemberIcon />
      </Button>
    </Link>
  </Tooltip>
);

export default RequestMembershipButton;
