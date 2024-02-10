'use client';

import { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

import { UserAndMembership } from '@/db/models/nodes';

/**
 * Sortable list of book club pick order
 *
 * @param {Object} props - Component props
 * @param {UserAndMembership[]} props.pickOrder - The pick order
 */
const BookClubPickOrderList = ({
  pickOrder
}: Readonly<{ pickOrder: UserAndMembership[] }>) => {
  const [order, setOrder] = useState(
    pickOrder.map(picker => ({ id: picker.user.email, ...picker }))
  );

  return (
    <ReactSortable
      list={order}
      setList={setOrder}
    >
      {order.map(picker => (
        <div
          key={picker.user.email}
          className="m-2 p-2 cursor-move border-medium border-gray-200 rounded-lg shadow-lg"
        >{`${picker.user.preferredName} (${picker.user.email})`}</div>
      ))}
    </ReactSortable>
  );
};

export default BookClubPickOrderList;
