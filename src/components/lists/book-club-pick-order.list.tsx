'use client';

import { useState } from 'react';
import { User } from '@nextui-org/user';
import { useSession } from 'next-auth/react';
import { ReactSortable } from 'react-sortablejs';

import { Role, UserAndMembership } from '@/db/models/nodes';
import AdvancePickerButton from '@/components/buttons/advance-picker.button';
import AdjustPickOrderButton from '@/components/buttons/adjust-pick-order.button';
import LinkButton from '@/components/buttons/link.button';

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

  // Session, including the user info, used to see if the current user is the current picker
  const session = useSession();

  // State for the pick order
  const [order, setOrder] = useState(
    pickOrder.map(picker => ({ id: picker.user.email, ...picker }))
  );

  // TODO - Check sortability after removing lodash isEqual
  return (
    <>
      <div className="flex justify-center gap-x-2 w-full">
        {sortable && (
          <AdvancePickerButton
            bookClubSlug={bookClubSlug}
            inAdminPage={inAdminPage}
          />
        )}
        {sortable &&
            order.map(picker => picker.user.email) !==
            pickOrder.map(picker => picker.user.email) && (
            <AdjustPickOrderButton
              bookClubSlug={bookClubSlug}
              pickOrder={order.map(picker => picker.user.email)}
              inAdminPage={inAdminPage}
            />
          )}
      </div>
      <ReactSortable
        list={order}
        setList={setOrder}
        sort={sortable}
      >
        {order.map((picker, idx) => (
          <div
            key={picker.user.email}
            className={`
              flex
              justify-between
              items-center
              m-2
              p-2
              ${sortable ? 'cursor-move' : ''}
              border-medium
              border-gray-200
              rounded-lg
              shadow-lg
              ${idx === 0 && session?.data?.user?.email === picker.user.email && 'border-secondary'}
            `}
          >
            <User
              name={picker.user.preferredName}
              description={picker.user.email}
              avatarProps={{
                src: picker.user.preferredImage,
                alt: picker.user.preferredName
              }}
            />
            {
              idx === 0 && session.data?.user?.email === picker.user.email &&
              <LinkButton
                uri={`/book-club/${bookClubSlug}/pick-book`}
                tooltip="Pick a book!"
                isIconOnly={false}
              >
                Make Pick
              </LinkButton>
            }
          </div>
        ))}
      </ReactSortable>
    </>
  );
};

export default BookClubPickOrderList;
