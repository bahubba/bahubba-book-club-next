import { Fragment, Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Divider } from '@nextui-org/divider';
import { User } from '@nextui-org/user';

import { getDiscussionReplies, getDiscussionReplyCount } from '@/api/fetchers/discussion.fetchers';
import { Pagination } from '@nextui-org/pagination';
import URLQueryPagination from '@/components/pagination/url-query.pagination';
import ReplyButton from '@/components/buttons/reply.button';
import { ScrollShadow } from '@nextui-org/scroll-shadow';

// Component props
interface DiscussionReplyListProps {
  bookClubSlug: string;
  discussionID: string;
  pageSize: number;
  pageNum: number;
}

interface DiscussionRepliesProps {
  bookClubSlug: string;
  discussionID: string;
  pageNum?: number;
  pageSize?: number;
}

/**
 * Async component for loading paginated replies
 *
 * @param {Object} props Component props
 * @param {string} props.bookClubSlug The slug of the book club
 * @param {string} props.discussionID The ID of the discussion
 * @param {number} props.pageNum The page number
 * @param {number} props.pageSize The number of replies per page
 */
const DiscussionReplies = async ({
  bookClubSlug,
  discussionID,
  pageNum = 1,
  pageSize = 10
}: DiscussionRepliesProps) => {
  // Fetch the replies
  const replies = await getDiscussionReplies(bookClubSlug, discussionID, pageSize, pageNum - 1);

  return (
    <ScrollShadow
      hideScrollBar
      className="flex-1 h-1 overflow-auto"
    >
      {
        replies.map((reply, idx) => (
          <Fragment key={reply.id}>
            <div className="flex-col w-full space-y-1">
              <div className="text-medium pt-2">{ reply.content }</div>
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
    </ScrollShadow>
  )
}

/**
 * Paginated display of discussion replies
 *
 * @param {Object} props Component props
 * @param {string} props.bookClubSlug The slug of the book club
 * @param {string} props.discussionID The ID of the discussion
 * @param {number} props.total The total number of replies
 */
const DiscussionReplyList = async ({
  bookClubSlug,
  discussionID,
  pageNum,
  pageSize
}: DiscussionReplyListProps) => {
  // Get the total number of replies
  const total = await getDiscussionReplyCount(bookClubSlug, discussionID);

  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={<></>}>
        <DiscussionReplies
          bookClubSlug={bookClubSlug}
          discussionID={discussionID}
          pageNum={pageNum}
          pageSize={pageSize}
        />
      </Suspense>
      <div className="flex justify-start">
        <ReplyButton
          bookClubSlug={bookClubSlug}
          discussionID={discussionID}
          nodeID={discussionID}
          replyToText={'Reply'}
          rootReply
        />
      </div>
      <div className="flex justify-center">
        <URLQueryPagination
          url={`/book-club/${bookClubSlug}/discussions/${discussionID}`}
          total={Math.ceil(total / pageSize)}
        />
      </div>
    </div>
  )
}

export default DiscussionReplyList;
