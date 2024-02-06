'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/table';

import { BookClubMembershipRequest } from '@/db/models/membership-request.models';
import ReviewMembershipRequestButton from '../buttons/review-membership-request.button';

/**
 * Table displaying membership requests in rows
 *
 * @prop {Object} props Component props
 * @prop {string} props.bookClubSlug The slug of the book club
 * @prop {BookClubMembershipRequest[]} props.membershipRequests The membership requests
 */
const MembershipRequestsTable = ({
  bookClubSlug,
  membershipRequests
}: Readonly<{
  bookClubSlug: string;
  membershipRequests: BookClubMembershipRequest[];
}>) => (
  <Table
    aria-label="Table of membership requests"
    isStriped
    isHeaderSticky
  >
    <TableHeader>
      <TableColumn key="email">Email</TableColumn>
      <TableColumn key="message">Message</TableColumn>
      <TableColumn key="requested">Requested</TableColumn>
      <TableColumn
        key="approve"
        align="center"
      >
        Approve
      </TableColumn>
      <TableColumn
        key="deny"
        align="center"
      >
        Deny
      </TableColumn>
    </TableHeader>
    <TableBody>
      {membershipRequests.map(membershipRequest => (
        <TableRow
          key={`${membershipRequest.userEmail}-${membershipRequest.requested}`}
        >
          <TableCell>{membershipRequest.userEmail}</TableCell>
          <TableCell>{membershipRequest.message}</TableCell>
          <TableCell>
            {new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }).format(membershipRequest.requested)}
          </TableCell>
          <TableCell>
            <ReviewMembershipRequestButton
              bookClubSlug={bookClubSlug}
              userEmail={membershipRequest.userEmail}
            />
          </TableCell>
          <TableCell>
            <ReviewMembershipRequestButton
              bookClubSlug={bookClubSlug}
              userEmail={membershipRequest.userEmail}
              isRejecting
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default MembershipRequestsTable;
