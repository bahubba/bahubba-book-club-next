'use client';

import { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { User } from '@nextui-org/user';

import { UserAndMembership } from '@/db/models/nodes';

/**
 * Sortable list of book club pick order
 *
 * @param {Object} props - Component props
 * @param {UserAndMembership[]} props.pickOrder - The pick order
 * @param {boolean} props.sortable - Whether the list is sortable; true if the user is an admin or owner
 */
const BookClubPickOrderList = ({
  pickOrder,
  sortable = false
}: Readonly<{ pickOrder: UserAndMembership[]; sortable: boolean }>) => {
  const [order, setOrder] = useState(
    pickOrder.map(picker => ({ id: picker.user.email, ...picker }))
  );

  return (
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
  );
};

export default BookClubPickOrderList;
