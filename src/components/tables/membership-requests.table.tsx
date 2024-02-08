'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/table';

import {
  MembershipRequestStatus,
  UserAndMembershipRequest
} from '@/db/models/nodes';
import ReviewMembershipRequestButton from '../buttons/review-membership-request.button';

/**
 * Table displaying membership requests in rows
 *
 * @prop {Object} props Component props
 * @prop {string} props.bookClubSlug The slug of the book club
 * @prop {MembershipRequestProperties[]} props.membershipRequests The membership requests
 */
const MembershipRequestsTable = ({
  bookClubSlug,
  membershipRequests
}: Readonly<{
  bookClubSlug: string;
  membershipRequests: UserAndMembershipRequest[];
}>) => (
  <Table
    aria-label="Table of membership requests"
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
          key={`${membershipRequest.user.email}-${membershipRequest.request.requested}`}
          className={
            membershipRequest.request.status ===
            MembershipRequestStatus.APPROVED
              ? 'bg-green-200'
              : membershipRequest.request.status ===
                MembershipRequestStatus.REJECTED
              ? 'bg-red-200'
              : ''
          }
        >
          <TableCell>{membershipRequest.user.email}</TableCell>
          <TableCell>{membershipRequest.request.requestMessage}</TableCell>
          <TableCell>{membershipRequest.request.requested as string}</TableCell>
          <TableCell>
            {membershipRequest.request.status ===
              MembershipRequestStatus.PENDING && (
              <ReviewMembershipRequestButton
                bookClubSlug={bookClubSlug}
                userEmail={membershipRequest.user.email}
              />
            )}
          </TableCell>
          <TableCell>
            {membershipRequest.request.status ===
              MembershipRequestStatus.PENDING && (
              <ReviewMembershipRequestButton
                bookClubSlug={bookClubSlug}
                userEmail={membershipRequest.user.email}
                isRejecting
              />
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default MembershipRequestsTable;
