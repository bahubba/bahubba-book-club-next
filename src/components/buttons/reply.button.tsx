'use client';

import { useCallback, useState } from 'react';
import { Button } from '@nextui-org/button';
import { useDisclosure } from '@nextui-org/modal';
import ReplyModal from '@/components/modals/reply.modal';

// Component props
export interface ReplyComponentProps {
  bookClubSlug: string;
  discussionID: string;
  nodeID: string;
  replyToText: string;
  rootReply?: boolean;
}

/**
 * Button encapsulating the modal for replying to a discussion or discussion comment
 *
 * @param {Object} props - Component props
 * @param {string} props.bookClubSlug - Slug of the book club
 * @param {string} props.nodeID - ID of the discussion or a reply
 * @param {string} props.replyToText - Text of the post or reply being replied to
 * @param {boolean} props.rootReply - Whether the reply is to the discussion (as opposed to a reply to a reply)
 */
const ReplyButton = (props: Readonly<ReplyComponentProps>) => {
  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Key state, used to refresh form modal on successful submission
  const [refreshKey, setRefreshKey] = useState(0);

  // Callback function for incrementing the refresh key to force reset the form in the modal
  const forceFormReset = useCallback(() => {
    onClose();
    setRefreshKey(prev => prev + 1)
  }, [onClose]);

  return (
    <>
      <Button
        variant="light"
        onClick={onOpen}
      >
        <span className="text-primary-500">Reply</span>
      </Button>
      <ReplyModal
        key={refreshKey}
        {...props}
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={forceFormReset}
      />
    </>
  )
}

export default ReplyButton;