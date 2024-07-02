'use client';

import { useFormState } from 'react-dom';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Input } from '@nextui-org/input';
import { Image } from '@nextui-org/image';
import SubmitButton from '@/components/buttons/submit.button';

import { handlePickBook } from '@/api/form-handlers/pick.form-handlers';
import { GoogleAPIBook } from '@/api/fetchers/book.fetchers';
import { Button } from '@nextui-org/button';

// Component props
interface PickBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookClubSlug: string;
  bookClubName: string;
  book: GoogleAPIBook;
}

/**
 * Confirm picking a book for a book club
 *
 * @param {ReadOnly<PickBookModalProps>} props
 * @param {boolean} props.isOpen Open status of the modal
 * @param {() => void} props.onClose Callback to close the modal
 * @param {string} props.bookClubSlug Slug of the book club being picked for
 * @param {string} props.bookClubName The name of the book club being picked for
 * @param {GoogleAPIBook} props.book The book being picked
 */
const PickBookModal = ({
  isOpen = false,
  onClose,
  bookClubSlug,
  bookClubName,
  book
}: Readonly<PickBookModalProps>) => {
  // Form state
  const [formState, formAction] = useFormState(handlePickBook, {
    error: '',
    succeeded: false
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent>
        {onClose => (
          <form action={formAction}>
            <ModalHeader>
              <span>Pick&nbsp;<i>{book.title}</i>&nbsp;for&nbsp;{bookClubName}</span>
            </ModalHeader>
            <Input
              className="hidden"
              name="bookClubSlug"
              value={bookClubSlug}
            />
            <Input
              className="hidden"
              name="bookID"
              value={book.id as string}
            />
            <Input
              className="hidden"
              name="title"
              value={book.title as string}
            />
            <Input
              className="hidden"
              name="authors"
              value={(book.authors as string[]).join(',')}
            />
            <Input
              className="hidden"
              name="description"
              value={book.description}
            />
            <Input
              className="hidden"
              name="thumbnail"
              value={book.thumbnail}
            />
            <Input
              className="hidden"
              name="description"
              value={book.description}
            />
            <Input
              className="hidden"
              name="identifiers"
              value={book.identifiers?.map(id => `${id.type ?? ''}:${id.identifier ?? ''}`).join(',')}
            />
            <ModalBody>
              <div className="flex justify-center w-full">
                <Image
                  src={book.thumbnail}
                  alt={`${book.title} cover`}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                color="danger"
                onClick={onClose}
                onPress={onClose}
              >
                Cancel
              </Button>
              <SubmitButton
                size="sm"
                color="success"
                buttonText="Confirm"
              />
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
};

export default PickBookModal;