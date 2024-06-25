'use client';

import { signOut } from 'next-auth/react';

import props from '@/util/properties';

const Error = ({ error, reset }: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  // If the error is for auth, logout
  if(props.APP.LOGOUT_ERRORS.includes(error.message)) signOut();

  return <></>;
}

export default Error;