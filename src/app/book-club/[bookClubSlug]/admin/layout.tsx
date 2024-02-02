import ProtectedRoute from '@/components/nav/protected-route.component';
import BookClubAdminTabs from '@/components/nav/tabs/book-club-admin.tabs';

// Component props
interface BookClubLayoutProps {
  children: React.ReactNode;
  params: {
    bookClubSlug: string;
  };
}

/**
 * Book club admin layout
 *
 * @prop {Object} props - The component props
 * @prop {React.ReactNode} props.children - The children components
 */
const BookClubAdminLayout = ({
  children,
  params: { bookClubSlug }
}: Readonly<BookClubLayoutProps>) => (
  <ProtectedRoute
    bookClubSlug={bookClubSlug}
    needsAdmin
  >
    <div className="flex flex-col min-w-[50vw] max-w-[75vw] max-h-fill-below-header gap-y-2">
      <h1 className="text-2xl font-bold">Book Club Admin</h1>
      <div className="flex justify-center w-full">
        <BookClubAdminTabs />
      </div>
      {children}
    </div>
  </ProtectedRoute>
);

export default BookClubAdminLayout;
