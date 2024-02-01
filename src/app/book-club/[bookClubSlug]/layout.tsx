import ProtectedRoute from '@/components/nav/protected-route.component';

// Component props
interface BookClubLayoutProps {
  children: React.ReactNode;
  params: {
    bookClubSlug: string;
  };
}

/**
 * Layout for the book club page; Protected route by user's membership in club
 *
 * @prop {Object} props Component props
 * @prop {React.ReactNode} props.children The children of the layout
 * @prop {params} props.params The parameters of the page
 * @prop {string} props.params.bookClubSlug The slug of the book club
 */
const BookClubLayout = ({
  children,
  params: { bookClubSlug }
}: Readonly<BookClubLayoutProps>) => (
  <ProtectedRoute bookClubSlug={bookClubSlug}>{children}</ProtectedRoute>
);

export default BookClubLayout;
