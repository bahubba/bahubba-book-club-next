'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/table';

import { BookClubMemberProjection } from '@/db/models/book-club.models';

/**
 * Table displaying members in rows as editable forms
 *
 * @prop {Object} props Component props
 * @prop {BookClubMemberProjection[]} props.members The members of the book club
 */
const BookClubAdminMembersTable = ({
  members
}: Readonly<{ members: BookClubMemberProjection[] }>) => {
  return (
    <Table
      aria-label="Table of members in the book club"
      isStriped
      isHeaderSticky
    >
      <TableHeader>
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="email">Email</TableColumn>
        <TableColumn key="role">Role</TableColumn>
        <TableColumn key="remove">Remove</TableColumn>
        <TableColumn key="joined">Joined</TableColumn>
      </TableHeader>
      <TableBody>
        {members.map(member => (
          <TableRow key={member.email}>
            <TableCell>{member.preferredName}</TableCell>
            <TableCell>{member.email}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>Remove</TableCell>
            <TableCell>{member.joined.toUTCString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookClubAdminMembersTable;
