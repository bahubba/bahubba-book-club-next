import ProtectedRoute from '@/components/nav/protected-route.component';

/**
 * Layout for the create book club page
 *
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children The children of the layout
 */
const BookClubPageLayout = ({
  children
}: Readonly<{ children: React.ReactNode }>) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export default BookClubPageLayout;
