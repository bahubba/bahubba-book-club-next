import { ReactNode } from 'react';

import ProtectedRoute from '@/components/nav/protected-route.component';

/**
 * Layout for the home page; Simple protected route
 *
 * @param {Readonly<{ children: ReactNode }>} props Component props
 * @param {ReactNode} props.children The children of the layout
 */
const HomePageLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export default HomePageLayout;
