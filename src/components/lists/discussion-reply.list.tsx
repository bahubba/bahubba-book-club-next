import { useEffect, useState } from 'react';

import { getDiscussionReplies } from '@/api/fetchers/discussion.fetchers';
import { ReplyProperties } from '@/db/models/nodes';

// Component props
// TODO - This is repeated; Create a single file for component props or reused props
interface DiscussionReplyListProps {
  bookClubSlug: string;
  discussionID: string;
}

/**
 * Paginated display of discussion replies
 *
 * @param {Object} props Component props
 * @param {string} props.bookClubSlug The slug of the book club
 * @param {string} props.discussionID The ID of the discussion
 */
const DiscussionReplyList = ({
  bookClubSlug,
  discussionID
}: DiscussionReplyListProps) => {
  // Component state
  const [replies, setReplies] = useState<ReplyProperties[]>([]); // Loaded replies
  const [pageNum, setPageNum] = useState(1); // Current page number
  const [total, setTotal] = useState(0); // Total number of replies
  const [loadedPages, setLoadedPages] = useState<number[]>([]); // Loaded pages [1, 2, 3, ...

  // On page number change, load replies
  useEffect(() => {
    // Async callback to load replies
    const loadReplies = async () => {
      // Fetch replies from API
      const newReplies = await getDiscussionReplies(bookClubSlug, discussionID, pageNum, 10);

      // Update replies
      setReplies(prev => [...prev, ...newReplies.replies]);
      setTotal(newReplies.total);
      setLoadedPages(prev => [...prev, pageNum]);
    };

    loadReplies();
  }, [bookClubSlug, discussionID, pageNum]);

  return (
    <div className="flex flex-col">

    </div>
  )
}

export default DiscussionReplyList;
