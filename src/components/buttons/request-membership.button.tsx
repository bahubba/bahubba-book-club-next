import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';
import { Tooltip } from '@nextui-org/tooltip';

import AddMemberIcon from '../icons/add-member.icon';
import { isBookClubMember } from '@/api/fetchers/book-club.fetchers';
import { hasOpenRequest } from '@/api/fetchers/membership-request.fetchers';

/**
 * Async component for the request membership button
 * @param {Object} props - The component props
 * @param {string} props.bookClubSlug - The slug of the book club
 */
const FilteredRequestMembershipButton = async ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => {
  // Check if the user is already a member of the book club
  const isMember = await isBookClubMember(bookClubSlug);

  // If the user is a member, don't show the button
  if (isMember) return <></>;

  // Check if the user has an open request
  const hasRequest = await hasOpenRequest(bookClubSlug);

  return (
    <Tooltip
      className="bg-opacity-75 bg-black text-white"
      content={hasRequest ? 'Membeship requested' : 'Request membership'}
    >
      <Link href={`/book-club/${bookClubSlug}/request-membership`}>
        <Button
          isIconOnly
          size="sm"
          color={hasRequest ? 'primary' : 'secondary'}
          aria-label={`Request membership to ${bookClubSlug}`}
          disabled={hasRequest}
        >
          <AddMemberIcon />
        </Button>
      </Link>
    </Tooltip>
  );
};

/**
 * Button linking to the request membership page for a book club
 *
 * @prop {Object} props - The component's props
 * @prop {string} props.bookClubSlug - The slug of the book club
 */
const RequestMembershipButton = ({
  bookClubSlug
}: Readonly<{ bookClubSlug: string }>) => (
  <Suspense fallback={<Spinner />}>
    <FilteredRequestMembershipButton bookClubSlug={bookClubSlug} />
  </Suspense>
);

export default RequestMembershipButton;
