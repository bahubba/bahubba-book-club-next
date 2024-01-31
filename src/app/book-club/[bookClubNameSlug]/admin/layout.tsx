import BookClubAdminTabs from '@/components/nav/tabs/book-club-admin.tabs';

const BookClubAdminLayout = ({
  children
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex flex-col min-w-[50vw] max-w-[75vw] max-h-fill-below-header gap-y-2">
      <h1 className="text-2xl font-bold">Book Club Admin</h1>
      <div className="flex justify-center w-full">
        <BookClubAdminTabs />
      </div>
      {children}
    </div>
  );
};

export default BookClubAdminLayout;
