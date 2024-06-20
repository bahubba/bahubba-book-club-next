'use client';

import { useSession } from 'next-auth/react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

/** The profile page, showing the user's profile information */
const ProfilePage = () => {
  const session = useSession();

  return (
    <div className="flex w-full h-full pb-2 justify-center items-center">
      <Table
        aria-label="Profile information"
        className="max-w-md"
        hideHeader
      >
        <TableHeader>
          <TableColumn>-</TableColumn>
          <TableColumn>-</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>Name</TableCell>
            <TableCell>{session.data?.user?.name}</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>Email</TableCell>
            <TableCell>{session.data?.user?.email}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfilePage;
