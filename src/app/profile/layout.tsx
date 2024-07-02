import { ReactNode } from 'react';

import ProtectedRoute from '@/components/nav/protected-route.component';

/**
 * Layout for the profile page; Simple protected route
 *
 * @param {Readonly<{ children: ReactNode }>} props Component props
 * @param {ReactNode} props.children Children of the component
 */
const ProfilePageLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export default ProfilePageLayout;
