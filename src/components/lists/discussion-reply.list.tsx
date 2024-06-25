import { Fragment, Suspense } from 'react';
import { Divider } from '@nextui-org/divider';
import { User } from '@nextui-org/user';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Spinner } from '@nextui-org/spinner';
import URLQueryPagination from '@/components/pagination/url-query.pagination';
import ReplyButton from '@/components/buttons/reply.button';

import { getDiscussionReplies, getDiscussionReplyCount } from '@/api/fetchers/discussion.fetchers';

// Component props
interface DiscussionReplyListProps {
  bookClubSlug: string;
  discussionID: string;
  pageSize: number;
  pageNum: number;
}

/**
 * Async component for paginated display of discussion replies
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

  // Fetch the replies
  const replies = await getDiscussionReplies(bookClubSlug, discussionID, pageSize, pageNum - 1);

  return (
    <div className="flex flex-col h-full">
      <Suspense
        fallback={
          <div className="flex-1 flex h-1 justify-center items-center">
            <Spinner />
          </div>
        }
      >
        <ScrollShadow
          hideScrollBar
          className="flex-1 h-1 overflow-auto"
        >
          {
            replies.map((reply, idx) => (
              <Fragment key={ reply.id }>
                <div className="flex-col w-full space-y-1">
                  <div className="text-medium pt-2">{ reply.content }</div>
                  <User
                    name={ reply.user.preferredName }
                    avatarProps={ {
                      src: reply.user.preferredImage || undefined,
                      alt: `${ reply.user.preferredName || 'user' } avatar`,
                      size: 'sm'
                    } }
                  />
                </div>
                { idx < replies.length - 1 && <Divider /> }
              </Fragment>
            ))
          }
          <div className="flex justify-start">
            <ReplyButton
              bookClubSlug={ bookClubSlug }
              discussionID={ discussionID }
              nodeID={ discussionID }
              replyToText={ 'Reply' }
              rootReply
            />
          </div>
        </ScrollShadow>
        <div className="flex justify-center">
          <URLQueryPagination
            url={ `/book-club/${ bookClubSlug }/discussions/${ discussionID }` }
            total={ Math.ceil(total / pageSize) }
          />
        </div>
      </Suspense>
    </div>
  );
};

export default DiscussionReplyList;
