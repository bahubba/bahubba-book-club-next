'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@nextui-org/button';

// Component props
interface AuthButtonProps {
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

/**
 * Button used to log in or out of the application
 * @param {'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'} color The color of the button
 */
const AuthButton = ({ color = 'default' }: AuthButtonProps) => {
  // Get the session, if it exists
  const { data: session } = useSession();

  // Sign in/out handlers
  const handleSignIn = () => signIn();
  const handleSignOut = () => signOut();

  return (
    <Button
      variant="light"
      color={ color }
      onClick={ session ? handleSignOut : handleSignIn }
    >
      { `Sign ${ session ? 'Out' : 'In' }` }
    </Button>
  );
};

export default AuthButton;
