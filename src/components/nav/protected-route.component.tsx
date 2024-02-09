import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import {
  getBookClubRole,
  getBookClubPublicity
} from '@/api/fetchers/book-club.fetchers';
import { Publicity, Role } from '@/db/models/nodes';

// Component props
interface ProtectedRouteProps {
  bookClubSlug?: string;
  needsAdmin?: boolean;
  children: React.ReactNode;
}

/** Wrapper for routes that redirects to login if not authenticated */
const ProtectedRoute = async ({
  bookClubSlug,
  needsAdmin = false,
  children
}: Readonly<ProtectedRouteProps>) => {
  // Get the session, if it exists
  const session = await getServerSession();

  // If there's no session, redirect to login
  if (!session || !session.user) redirect('/');

  // If there's a book club slug, check publicity or the user's membership
  if (bookClubSlug) {
    // Get the book club's publicity
    const publicity = await getBookClubPublicity(bookClubSlug);

    // If the publicity couldn't be found, redirect to the home page
    if (!publicity) redirect('/home');

    // If the book club is not public, check the user's membership
    if (publicity !== Publicity.PUBLIC) {
      const role = await getBookClubRole(bookClubSlug);

      // If the user isn't a member, redirect to the book club page
      if (!role) redirect('/home');
      if (needsAdmin && ![Role.OWNER, Role.ADMIN].includes(role))
        redirect(`/book-club/${bookClubSlug}`);
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
