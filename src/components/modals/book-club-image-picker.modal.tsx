'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure
} from '@nextui-org/modal';

import BookClubImagePicker from '@/components/pickers/book-club-image.picker';

// Component props
interface BookClubImagePickerModalProps {
  selectedImage: string;
  setSelectedImage: (imageName: string) => void;
}

/**
 * Modal for selecting a book club image
 *
 * @param {Object} props - Component props
 * @param {string} props.selectedImage - Currently selected image
 * @param {Function} props.setSelectedImage - Function to set the selected image
 */
const BookClubImagePickerModal = ({
  selectedImage,
  setSelectedImage
}: Readonly<BookClubImagePickerModalProps>) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Input
        className="cursor-pointer"
        variant="bordered"
        name="image"
        onClick={onOpen}
        startContent={
          <Button
            size="sm"
            onClick={onOpen}
          >
            Select Image
          </Button>
        }
        disabled
        value={selectedImage}
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        isDismissable={false}
        hideCloseButton
        backdrop="blur"
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader>Select Image</ModalHeader>
              <ModalBody>
                <BookClubImagePicker
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color={selectedImage === '' ? 'default' : 'success'}
                  onClick={onClose}
                  disabled={selectedImage === ''}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default BookClubImagePickerModal;
