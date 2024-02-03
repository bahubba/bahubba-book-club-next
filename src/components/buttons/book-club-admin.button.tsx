import Link from 'next/link';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';

import AdminIcon from '@/components/icons/admin.icon';

/**
 * Button linking to a book club admin page
 *
 * @prop {Object} props - The component's props
 * @prop {string} props.bookClubSlug - The slug of the book club
 */
const BookClubAdminButton = ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => (
  <Tooltip
    className="bg-opacity-75 bg-black text-white"
    content="Book Club Admin"
  >
    <Link href={`/book-club/${bookClubSlug}/admin`}>
      <Button
        isIconOnly
        size="sm"
        color="secondary"
        aria-label={`${bookClubSlug} admin page button`}
      >
        <AdminIcon />
      </Button>
    </Link>
  </Tooltip>
);

export default BookClubAdminButton;
