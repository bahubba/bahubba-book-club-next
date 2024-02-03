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

/**
 * Table displaying membership requests in rows
 *
 * @prop {Object} props Component props
 * @prop {BookClubMembershipRequest[]} props.membershipRequests The membership requests
 */
const MembershipRequestsTable = ({
  membershipRequests
}: Readonly<{ membershipRequests: BookClubMembershipRequest[] }>) => (
  <Table
    aria-label="Table of membership requests"
    isStriped
    isHeaderSticky
  >
    <TableHeader>
      <TableColumn key="email">Email</TableColumn>
      <TableColumn key="message">Message</TableColumn>
      <TableColumn key="requested">Requested</TableColumn>
      <TableColumn key="approve">Approve</TableColumn>
      <TableColumn key="deny">Deny</TableColumn>
    </TableHeader>
    <TableBody>
      {membershipRequests.map(membershipRequest => (
        <TableRow key={membershipRequest.userEmail}>
          <TableCell>{membershipRequest.userEmail}</TableCell>
          <TableCell>{membershipRequest.message}</TableCell>
          <TableCell>{membershipRequest.requested.toUTCString()}</TableCell>
          <TableCell>Approve</TableCell>
          <TableCell>Deny</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default MembershipRequestsTable;
