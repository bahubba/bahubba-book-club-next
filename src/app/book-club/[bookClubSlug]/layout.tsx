import { ReactNode } from 'react';

import ProtectedRoute from '@/components/nav/protected-route.component';

// Component props
interface BookClubLayoutProps {
  children: ReactNode;
  params: {
    bookClubSlug: string;
  };
}

/**
 * Layout for the book club page; Protected route by user's membership in club
 *
 * @param {Readonly<BookClubLayoutProps>} props Component props
 * @param {{ bookClubSlug }} props.params The parameters of the page
 * @param {string} props.params.bookClubSlug The slug of the book club
 * @param {ReactNode} props.children The children of the layout
 */
const BookClubLayout = ({ params: { bookClubSlug }, children }: Readonly<BookClubLayoutProps>) => (
  <ProtectedRoute bookClubSlug={bookClubSlug}>{children}</ProtectedRoute>
);

export default BookClubLayout;
