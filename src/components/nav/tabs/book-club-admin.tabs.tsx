'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tab, Tabs } from '@nextui-org/tabs';

/** Navigation tabs for the book club admin page */
const BookClubAdminTabs = () => {
  // Router used to navigate after selecting a tab
  const router = useRouter();

  // Split out the parts of the URL path
  const pathname = usePathname();
  const pathPrefix = pathname.substring(0, pathname.lastIndexOf('/'));
  const adminPath = pathname.substring(pathname.lastIndexOf('/') + 1);

  // Handle selecting a tab
  const handleSelect = (key: string | number) => {
    router.push(`${pathPrefix}/${key}`);
  };

  return (
    <Tabs
      aria-label="Book club admin tabs"
      variant="bordered"
      color="secondary"
      selectedKey={adminPath}
      onSelectionChange={handleSelect}
      fullWidth
    >
      <Tab
        key="details"
        title="Details"
      />
      <Tab
        key="members"
        title="Members"
      />
      <Tab
        key="membership-requests"
        title="Membership Requests"
      />
    </Tabs>
  );
};

export default BookClubAdminTabs;
