'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { User } from '@nextui-org/user';

/** An avatar for the current user, which links to their profile page */
const UserAvatar = () => {
  // Get the current user's session
  const session = useSession();

  return !session.data ? (
    <></>
  ) : (
    <Link href="/profile">
      <User
        name={ session.data?.user?.name ?? 'Anonymous user' }
        description={ session.data?.user?.email ?? 'No email' }
        avatarProps={ {
          src: session.data?.user?.image || undefined,
          alt: session.data?.user?.name || 'Anonymous user avatar'
        } }
      />
    </Link>
  );
};

export default UserAvatar;
