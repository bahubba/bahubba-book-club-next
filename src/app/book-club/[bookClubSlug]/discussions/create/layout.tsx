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
    <div className="flex justify-center w-full max-h-fill-below-header">
      <div className="flex flex-col min-w-[50vw] max-w-[75vw] gap-y-2">
        <h1 className="flex-shrink text-2xl font-bold">
          Start New Book Club Discussion
        </h1>
        {children}
      </div>
    </div>
  </ProtectedRoute>
);

export default CreateDiscussionLayout;
