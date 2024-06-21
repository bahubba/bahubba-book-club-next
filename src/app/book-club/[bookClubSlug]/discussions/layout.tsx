import ProtectedRoute from '@/components/nav/protected-route.component';

// Component props
interface CreateDiscussionLayoutProps {
  children: React.ReactNode;
  params: {
    bookClubSlug: string;
  };
}

/**
 * Layout for book club discussion creation
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The children components
 * @param {Object} props.params - The route parameters
 * @param {string} props.params.bookClubSlug - The slug of the book club
 */
const CreateDiscussionLayout = ({
  children,
  params: { bookClubSlug }
}: Readonly<CreateDiscussionLayoutProps>) => (
  <ProtectedRoute
    bookClubSlug={bookClubSlug}
    needsAdmin
  >
    <div className="flex h-full justify-center">
      <div className="flex flex-col h-full w-[75]-vw pb-2">{children}</div>
    </div>
  </ProtectedRoute>
);

export default CreateDiscussionLayout;
