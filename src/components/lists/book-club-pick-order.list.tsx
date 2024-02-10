'use client';

import { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { User } from '@nextui-org/user';

import { Role, UserAndMembership } from '@/db/models/nodes';
import AdvancePickerButton from '../buttons/advance-picker.button';

// Component props
interface BookClubPickOrderListProps {
  pickOrder: UserAndMembership[];
  bookClubSlug: string;
  memberRole: Role;
  inAdminPage?: boolean;
}

/**
 * Sortable list of book club pick order
 *
 * @param {Object} props - Component props
 * @param {UserAndMembership[]} props.pickOrder - The pick order
 * @param {string} props.bookClubSlug - The slug of the book club
 * @param {Role} props.memberRole - The role of the current user
 * @param {boolean} props.inAdminPage - Whether the list is in the admin page
 */
const BookClubPickOrderList = ({
  pickOrder,
  bookClubSlug,
  memberRole,
  inAdminPage = false
}: Readonly<BookClubPickOrderListProps>) => {
  // Static boolean for whether the list is sortable
  const sortable = [Role.ADMIN, Role.OWNER].includes(memberRole);

  // State for the pick order
  const [order, setOrder] = useState(
    pickOrder.map(picker => ({ id: picker.user.email, ...picker }))
  );

  return (
    <>
      <div className="flex justify-center w-full">
        <AdvancePickerButton
          bookClubSlug={bookClubSlug}
          memberRole={memberRole}
          inAdminPage={inAdminPage}
        />
      </div>
      <ReactSortable
        list={order}
        setList={setOrder}
        sort={sortable}
      >
        {order.map(picker => (
          <div
            key={picker.user.email}
            className={`m-2 p-2 ${
              sortable ? 'cursor-move' : ''
            } border-medium border-gray-200 rounded-lg shadow-lg`}
          >
            <User
              name={picker.user.preferredName}
              description={picker.user.email}
              avatarProps={{
                src: picker.user.preferredImage,
                alt: picker.user.preferredName
              }}
            />
          </div>
        ))}
      </ReactSortable>
    </>
  );
};

export default BookClubPickOrderList;