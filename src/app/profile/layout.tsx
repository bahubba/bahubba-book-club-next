import ProtectedRoute from '@/components/nav/protected-route.component';

/** Layout for the profile page; Simple protected route */
const ProfilePageLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <ProtectedRoute>{ children }</ProtectedRoute>;
};

export default ProfilePageLayout;
