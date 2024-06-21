'use client';

import { Fragment, useEffect, useState } from 'react';

import { getDiscussionReplies } from '@/api/fetchers/discussion.fetchers';
import { ReplyWithUser } from '@/db/models/nodes';
import { User } from '@nextui-org/user';
import { Divider } from '@nextui-org/divider';
import { Button } from '@nextui-org/button';

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
  const [replies, setReplies] = useState<ReplyWithUser[]>([]); // Loaded replies
  const [pageNum, setPageNum] = useState(1); // Current page number
  const [total, setTotal] = useState(-1); // Total number of replies
  const [loadedPages, setLoadedPages] = useState<number[]>([]); // Loaded pages [1, 2, 3, ...

  // On page number change, load replies
  useEffect(() => {
    // Async callback to load replies
    const loadReplies = async () => {
      // Fetch replies from API
      const newReplies = await getDiscussionReplies(bookClubSlug, discussionID, pageNum - 1, 10);
      console.log('newReplies:::', newReplies); // DELETEME

      // Update replies
      setReplies(prev => [...prev, ...newReplies.replies]);
      setTotal(newReplies.total);
      setLoadedPages(prev => [...prev, pageNum]);
    };

    if((total === -1 || (total > 0 && pageNum < Math.ceil(total / 10))) && !loadedPages.includes(pageNum)) loadReplies();
  }, [bookClubSlug, discussionID, pageNum, total, loadedPages]);

  // DELETEME
  useEffect(() => {
    console.log('loadedPages:::', loadedPages);
  }, [loadedPages]);

  // Handle clicking on the load more button
  const handleLoadMore = () => setPageNum(prev => prev + 1);

  return (
    <div className="flex flex-col">
      {
        replies.map((reply, idx) => (
          <Fragment key={reply.id}>
            <div className="w-full flex-col space-y-0.5">
              <div className="text-medium">{ reply.content }</div>
              <User
                name={reply.user.preferredName}
                avatarProps={{
                  src: reply.user.preferredImage || undefined,
                  alt: `${reply.user.preferredName || 'user'} avatar`,
                  size: 'sm'
                }}
              />
            </div>
            {idx < replies.length - 1 && <Divider />}
          </Fragment>
        ))
      }
      { pageNum < Math.ceil(total / 10) && <Button onClick={ handleLoadMore }>Load More...</Button> }
    </div>
  )
}

export default DiscussionReplyList;
