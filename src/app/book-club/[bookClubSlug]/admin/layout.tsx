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
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The children components
 * @param {Object} props.params - The route parameters
 * @param {string} props.params.bookClubSlug - The slug of the book club
 */
const BookClubAdminLayout = ({
  children,
  params: { bookClubSlug }
}: Readonly<BookClubLayoutProps>) => (
  <ProtectedRoute
    bookClubSlug={bookClubSlug}
    needsAdmin
  >
    <div className="flex justify-center w-full max-h-fill-below-header">
      <div className="flex flex-col min-w-[50vw] max-w-[75vw] gap-y-2">
        <h1 className="text-2xl font-bold">Book Club Admin</h1>
        <div className="flex justify-center w-full">
          <BookClubAdminTabs />
        </div>
        {children}
      </div>
    </div>
  </ProtectedRoute>
);

export default BookClubAdminLayout;
