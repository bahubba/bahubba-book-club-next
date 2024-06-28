'use client';

import { useFormState } from 'react-dom';

import { handlePickBook } from '@/api/form-handlers/pick.form-handlers';

// Component props
interface PickBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookClubSlug: string;
  googleBooksID: string;
}

/**
 * Confirm picking a book for a book club
 *
 * @param {boolean} isOpen Open status of the modal
 * @param {() => void} onClose Callback to close the modal
 * @param {string} bookClubSlug Slug of the book club being picked for
 * @param {string} googleBooksID The Google Books API ID for the book being picked
 */
const PickBookModal = ({
  isOpen = false,
  onClose,
  bookClubSlug,
  googleBooksID
}: Readonly<PickBookModalProps>) => {
  // Form state
  const [formState, formAction] = useFormState(handlePickBook, {
    error: '',
    succeeded: false
  });


};

export default PickBookModal;