'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Avatar } from '@nextui-org/avatar';

/** An avatar for the current user, which links to their profile page */
const UserAvatar = () => {
  // Get the current user's session
  const session = useSession();

  return (
    <Link href="/profile">
      <Avatar
        src={ session.data?.user?.image || undefined }
        name={ !session.data?.user?.image && session.data?.user?.name || 'Anonymous user' }
      />
    </Link>
  );
};

export default UserAvatar;