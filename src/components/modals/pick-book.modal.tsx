'use client';

import { useFormState } from 'react-dom';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Input } from '@nextui-org/input';
import { Image } from '@nextui-org/image';
import { Divider } from '@nextui-org/divider';
import SubmitButton from '@/components/buttons/submit.button';

import { handlePickBook } from '@/api/form-handlers/pick.form-handlers';
import { GoogleAPIBook } from '@/api/fetchers/book.fetchers';

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
 * @param {boolean} isOpen Open status of the modal
 * @param {() => void} onClose Callback to close the modal
 * @param {string} bookClubSlug Slug of the book club being picked for
 * @param {string} bookCLubName The name of the book club being picked for
 * @param {GoogleAPIBook} book The book being picked
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
            <ModalHeader>{`${bookClubName} Pick`}</ModalHeader>
            <Input
              className="hidden"
              name="bookClubSlug"
              value={bookClubSlug}
            />
            <Input
              className="hidden"
              name="bookID"
              value={book.id || undefined}
            />
            <ModalBody>
              <div className="flex">
                <Image
                  src={book.thumbnail}
                  alt={`${book.title} cover`}
                />
                <Divider orientation="vertical" />
                <h3>{book.title}</h3>
                <span>Confirm pick?</span>
              </div>
            </ModalBody>
            <ModalFooter>
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