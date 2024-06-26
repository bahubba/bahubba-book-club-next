'use client';

import { useSession } from 'next-auth/react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

import MemberRoleForm from '../forms/member-role.form';
import RemoveMemberButton from '../buttons/remove-member.button';
import { Role, UserAndMembership } from '@/db/models/nodes';

// Component props
interface BookClubAdminMembersTableProps {
  bookClubSlug: string;
  adminEmail: string;
  adminRole: Role;
  members: UserAndMembership[];
}

/**
 * Table displaying members in rows as editable forms
 *
 * @param {Object} props Component props
 * @param {string} props.bookClubSlug The slug of the book club
 * @param {Role} props.adminRole The role of the current user
 * @param {UserAndMembership[]} props.members The members of the book club
 */
const BookClubAdminMembersTable = ({
  bookClubSlug,
  adminEmail,
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
        <TableColumn key="joined">Joined</TableColumn>
        <TableColumn
          key="remove"
          align="center"
        >
          Remove
        </TableColumn>
      </TableHeader>
      <TableBody>
        {members.map(member => (
          <TableRow key={member.user.email}>
            <TableCell>{member.user.preferredName}</TableCell>
            <TableCell>{member.user.email}</TableCell>
            <TableCell>
              <MemberRoleForm
                bookClubSlug={bookClubSlug}
                email={data?.user?.email ?? ''}
                memberEmail={member.user.email}
                adminRole={adminRole}
                role={member.membership.role}
              />
            </TableCell>
            <TableCell>
              {typeof member.membership.joined === 'string'
                ? member.membership.joined
                : new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }).format(member.membership.joined)}
            </TableCell>
            <TableCell>
              <RemoveMemberButton
                bookClubSlug={bookClubSlug}
                adminEmail={adminEmail}
                adminRole={adminRole}
                userEmail={member.user.email}
                memberRole={member.membership.role}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookClubAdminMembersTable;
