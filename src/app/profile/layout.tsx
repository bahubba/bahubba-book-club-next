import ProtectedRoute from '@/components/nav/protected-route.component';

/** Layout for the profile page; Simple protected route */
const ProfilePageLayout = ({
  children
}: Readonly<{ children: React.ReactNode }>) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export default ProfilePageLayout;
