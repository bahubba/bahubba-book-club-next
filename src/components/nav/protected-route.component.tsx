import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

/** Wrapper for routes that redirects to login if not authenticated */
const ProtectedRoute = async ({
  children
}: Readonly<{ children: React.ReactNode }>) => {
  // Get the session, if it exists
  const session = await getServerSession();

  // If there's no session, redirect to login
  if (!session || !session.user) redirect('/');

  return <>{children}</>;
};

export default ProtectedRoute;
