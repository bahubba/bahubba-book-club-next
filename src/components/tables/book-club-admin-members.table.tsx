'use client';

import { useSession } from 'next-auth/react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/table';

import { BookClubMemberProjection, Role } from '@/db/models/book-club.models';
import MemberRoleForm from '../forms/member-role.form';

// Component props
interface BookClubAdminMembersTableProps {
  bookClubSlug: string;
  adminRole: Role;
  members: BookClubMemberProjection[];
}

/**
 * Table displaying members in rows as editable forms
 *
 * @prop {Object} props Component props
 * @prop {BookClubMemberProjection[]} props.members The members of the book club
 */
const BookClubAdminMembersTable = ({
  bookClubSlug,
  adminRole,
  members
}: Readonly<BookClubAdminMembersTableProps>) => {
  // Get the current session and the user's email
  const { data } = useSession();

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
            <TableCell>
              <MemberRoleForm
                bookClubSlug={bookClubSlug}
                email={data?.user?.email ?? ''}
                memberEmail={member.email}
                adminRole={adminRole}
                role={member.role}
              />
            </TableCell>
            <TableCell>Remove</TableCell>
            <TableCell>
              {new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }).format(member.joined)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookClubAdminMembersTable;
