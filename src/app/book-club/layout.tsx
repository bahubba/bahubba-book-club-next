import { ReactNode } from 'react';

import ProtectedRoute from '@/components/nav/protected-route.component';

/**
 * Layout for the create book club page
 *
 * @param {Readonly<{ children: ReactNode }>} props Component props
 * @param {ReactNode} props.children The children of the layout
 */
const BookClubPageLayout = ({ children }: Readonly<{ children: ReactNode }>) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export default BookClubPageLayout;
