import { ReactNode } from 'react';

import ProtectedRoute from '@/components/nav/protected-route.component';

// Component props
interface CreateDiscussionLayoutProps {
  children: ReactNode;
  params: {
    bookClubSlug: string;
  };
}

/**
 * Layout for book club discussion creation
 *
 * @param {Readonly<CreateDiscussionLayoutProps>} props Component props
 * @param {Object} props.params The route parameters
 * @param {string} props.params.bookClubSlug The slug of the book club
 * @param {ReactNode} props.children The children components
 */
const CreateDiscussionLayout = ({ params: { bookClubSlug }, children }: Readonly<CreateDiscussionLayoutProps>) => (
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
