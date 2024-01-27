import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import props from '@/util/properties';

/** Root page for the application, displaying a logo if not logged in and redirecting to /home otherwise */
const RootPage = async () => {
  // Get the session, if it exists
  const session = await getServerSession();

  // If there is a session, redirect to home
  if (session?.user) redirect('/home');

  return (
    <div className="flex h-full justify-center text-center">
      <div className="flex flex-col h-full justify-around">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{ `Welcome to ${ props.APP.NAME }` }</h1>
          <Link href="/api/auth/signin" className="text-blue-800 underline">Please sign in to continue</Link>
        </div>
        <Image
          src="/favicon.ico"
          alt="A pixelated, abstract image suggesting a lion head made out of bookshelves and books"
          width="500"
          height="500"
        />
      </div>
    </div>
  );
};

export default RootPage;
