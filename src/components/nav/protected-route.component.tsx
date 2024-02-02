import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { getBookClubMembership } from '@/api/fetchers/book-club.fetchers';
import { Role } from '@/db/models/book-club.models';

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

  // If there's a book club slug, check if the user is an member or admin
  if (bookClubSlug) {
    const role = await getBookClubMembership(bookClubSlug);

    // If the user isn't a member, redirect to the book club page
    if (!role) redirect('/home');
    if (needsAdmin && ![Role.OWNER, Role.ADMIN].includes(role))
      redirect(`/book-club/${bookClubSlug}`);
  }

  return <>{children}</>;
};

export default ProtectedRoute;
