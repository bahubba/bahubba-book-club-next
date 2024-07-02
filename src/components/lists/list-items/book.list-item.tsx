'use client';

import { Image } from '@nextui-org/image';
import { useDisclosure } from '@nextui-org/modal';

import { GoogleAPIBook } from '@/api/fetchers/book.fetchers';
import PickBookModal from '@/components/modals/pick-book.modal';

// Component props
interface BookListItemProps {
  book: GoogleAPIBook;
  pickable?: boolean;
  bookClubSlug?: string;
  bookClubName?: string;
}

/**
 * List item for a book
 *
 * @param {Readonly<BookListItemProps>} props
 * @param {GoogleAPIBook} props.book Details about the book
 * @param {boolean} props.pickable Whether the book can be picked
 * @param {string} props.bookClubSlug If pickable, the slug of the book club being picked for
 * @param {string} props.bookClubName If pickable, the name of the book club being picked for
 */
const BookListItem = (
  {
    book,
    pickable = false,
    bookClubSlug,
    bookClubName
  }: Readonly<BookListItemProps>
) => {
  // Pick book modal state
  const { isOpen: pickModalOpen, onOpen: handleOpenPickModal, onClose: handleClosePickModal } = useDisclosure();

  // When pickable, handle clicking on a book
  const handleClick = () => {
    if(fullyPickable) handleOpenPickModal();
  }

  // Statically determine if all pickable conditions are met
  // TODO - Add messaging for when a book should be pickable, but is missing title or authors,
  //        either in a tooltip or within the pick modal
  const fullyPickable = pickable &&
    !!bookClubSlug &&
    !!bookClubName &&
    !!book.title &&
    !!book.authors &&
    bookClubSlug.length > 0 &&
    bookClubName.length > 0 &&
    book.title.length > 0 &&
    book.authors.length > 0;

  return (
    <>
      <div
        className={
          'flex p-2 gap-x-2 rounded-2xl ' +
          `${fullyPickable ? 'cursor-pointer hover:bg-secondary-50' : ''}`
        }
        onClick={handleClick}
      >
        <div className="flex-shrink flex items-center">
          <Image
            src={book.thumbnail}
            alt={`${book.title} cover`}
          />
        </div>
        <div className="flex-1 flex flex-col gap-y-2">
          <h3>{book.title}</h3>
          <small className="overflow-hidden line-clamp-5">{book.description}</small>
        </div>
      </div>
      {fullyPickable &&
        <PickBookModal
          isOpen={pickModalOpen}
          onClose={handleClosePickModal}
          bookClubSlug={bookClubSlug}
          bookClubName={bookClubName}
          book={book}
        />
      }
    </>
  );
}

export default BookListItem;