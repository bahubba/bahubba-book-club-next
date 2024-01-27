'use client';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@nextui-org/button';

/** Button used to log in or out of the application */
const AuthButton = () => {
  // Get the session, if it exists
  const { data: session } = useSession();

  // Sign in/out handlers
  const handleSignIn = () => signIn();
  const handleSignOut = () => signOut();

  return (
    <Button
      color="secondary"
      onClick={ session ? handleSignOut : handleSignIn }
    >
      { `Sign ${ session ? 'Out' : 'In' }` }
    </Button>
  );
};

export default AuthButton;
