'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { handleReplyToDiscussion } from '@/api/form-handlers/discussion-form.handlers';
import SubmitButton from '../buttons/submit.button';
import { ReplyComponentProps } from '@/components/buttons/reply.button';

// Component props
interface ReplyModalProps extends ReplyComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal for replying to a discussion
 *
 * @param {Object} props - Component props
 * @param {string} props.bookClubSlug - Slug of the book club
 * @param {string} props.nodeID - ID of the discussion or a reply
 * @param {string} props.replyToText - Text of the post or reply being replied to
 * @param {boolean} props.rootReply - Whether the reply is to the discussion (as opposed to a reply to a reply)
 * @param {boolean} props.isOpen - Open status of the modal from useDisclosure
 * @param {function} props.onClose - Callback for closing the modal from useDisclosure
 * @param {function} props.onSuccess - Callback for force resetting the form (and closing the modal)
 */
const ReplyModal = ({
                      bookClubSlug,
                      discussionID,
                      nodeID,
                      replyToText,
                      rootReply = false,
                      isOpen,
                      onClose,
                      onSuccess
                    }: Readonly<ReplyModalProps>) => {
  // Form state
  const [ formState, formAction ] = useFormState(handleReplyToDiscussion, {
    error: '',
    succeeded: false
  });

  // Reply text state
  const [ replyText, setReplyText ] = useState('');

  // Handle text input
  const handleReplyTextInput = ({
                                  target: { value }
                                }: ChangeEvent<HTMLInputElement>) => setReplyText(value);

  // Listen for form submission success and trigger a hard reset
  useEffect(() => {
    if (formState.succeeded) onSuccess();
  }, [ formState.succeeded ]);

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ onClose }
      scrollBehavior="inside"
      hideCloseButton
      backdrop="blur"
    >
      <ModalContent>
        { onClose => (
          <form action={ formAction }>
            <ModalHeader>{ replyToText }</ModalHeader>
            <Input
              className="hidden"
              name="slug"
              value={ bookClubSlug }
            />
            <Input
              className="hidden"
              name="discussionID"
              value={ discussionID }
            />
            <Input
              className="hidden"
              name="nodeID"
              value={ nodeID }
            />
            <Input
              className="hidden"
              name="rootReply"
              value={ rootReply.toString() }
            />
            <ModalBody>
              <Textarea
                placeholder="Reply..."
                rows={ 5 }
                name="content"
                onChange={ handleReplyTextInput }
              />
            </ModalBody>
            <ModalFooter>
              <Button
                size="sm"
                variant="light"
                onClick={ onClose }
              >
                Cancel
              </Button>
              <SubmitButton
                size="sm"
                color={ replyText.trim() === '' ? 'default' : 'success' }
                disabled={ replyText.trim() === '' }
                buttonText="Reply"
              />
            </ModalFooter>
          </form>
        ) }
      </ModalContent>
    </Modal>
  );
};

export default ReplyModal;
