import ProtectedRoute from '@/components/nav/protected-route.component';

/**
 * Layout for the create book club page
 *
 * @param {React.ReactNode} children The children of the layout
 */
const CreateBookClubPageLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ProtectedRoute>
      <div className="flex items-start justify-center w-full">
        <div className="flex flex-col min-w-[50%]">
          <h1 className="text-2xl font-bold">Create Book Club</h1>
          { children }
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CreateBookClubPageLayout;