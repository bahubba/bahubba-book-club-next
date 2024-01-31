'use client';

import { usePathname } from 'next/navigation';
import { Listbox, ListboxItem } from '@nextui-org/listbox';

import PlusIcon from '../icons/plus.icon';

/**
 * Side nav menu for the book club admin page
 */
const BookClubAdminMenu = () => {
  const pathname = usePathname();
  const adminPath = pathname.substring(pathname.lastIndexOf('/') + 1);

  return (
    <Listbox
      className="border-solid border-black border-2 p-0 m-0 border-r-large"
      variant="flat"
      aria-label="Book club admin menu"
    >
      <ListboxItem
        key="details"
        className={adminPath === 'details' ? 'bg-gray-400' : ''}
        startContent={<PlusIcon />}
      >
        Details
      </ListboxItem>
      <ListboxItem
        key="members"
        className={adminPath === 'members' ? 'bg-gray-400' : ''}
        startContent={<PlusIcon />}
      >
        Members
      </ListboxItem>
      <ListboxItem
        key="membership-requests"
        className={adminPath === 'membership-requests' ? 'bg-gray-400' : ''}
        startContent={<PlusIcon />}
      >
        Membership Requests
      </ListboxItem>
    </Listbox>
  );
};

export default BookClubAdminMenu;
