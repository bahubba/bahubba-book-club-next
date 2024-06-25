'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

/** Welcome text with the user's name that links to their profile page */
const ProfileLink = () => {
  // Get the session, if it exists
  const { data: session } = useSession();

  return session ? (
    <Link
      href="/profile"
      className="italic"
    >
      Welcome, { session?.user?.name }
    </Link>
  ) : (
    <></>
  );
};

export default ProfileLink;
