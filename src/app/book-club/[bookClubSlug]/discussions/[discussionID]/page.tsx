import { Suspense } from 'react';

import { getDiscussion } from '@/api/fetchers/discussion.fetchers';
import ReplyButton from '@/components/buttons/reply.button';
import DiscussionReplyList from '@/components/lists/discussion-reply.list';

// Component props
interface Slugs {
  bookClubSlug: string;
  discussionID: string;
}

interface ReplyListProps extends Slugs {
  pageNum: number;
  pageSize: number;
}

interface BookClubDiscussionPageProps {
  params: Slugs;
  searchParams?: {
    pageNum?: string;
    pageSize?: string;
  }
}

/**
 * Async component for the book club discussion header
 *
 * @param {Object} props Component props
 * @param {string} props.bookClubSlug The slug of the book club
 * @param {string} props.discussionID The slug of the discussion
 * @param {number} props.pageNum The page number from the URL query
 * @param {number} props.pageSize The page size from the URL query
 */
const BookClubDiscussionContent = async ({
  bookClubSlug,
  discussionID,
  pageNum,
  pageSize
}: Readonly<ReplyListProps>) => {
  // Load the discussion
  const discussion = await getDiscussion(bookClubSlug, discussionID);

  return (
    <>
      <div className="flex-shrink flex-grow-0">
        <h1 className="text-2xl font-bold my-2">{discussion.title}</h1>
        <p className="text-gray-500">{discussion.description}</p>
      </div>
      <div className="flex flex-1 flex-col w-full h-1">
        <Suspense fallback={<></>}>
          <DiscussionReplyList
            bookClubSlug={bookClubSlug}
            discussionID={discussionID}
            pageNum={pageNum}
            pageSize={pageSize}
          />
        </Suspense>
      </div>
    </>
  );
};

/**
 * Book club discussion page
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - The route parameters
 * @param {string} props.params.bookClubSlug - The slug of the book club
 */
const BookClubDiscussionPage = ({
  params: { bookClubSlug, discussionID },
  searchParams: {
    pageNum = '1',
    pageSize = '10'
  } = {
    pageNum: '1',
    pageSize: '10'
  }
}: Readonly<BookClubDiscussionPageProps>) => (
  <Suspense fallback={<></>}>
    <BookClubDiscussionContent
      bookClubSlug={bookClubSlug}
      discussionID={discussionID}
      pageNum={parseInt(pageNum)}
      pageSize={parseInt(pageSize)}
    />
  </Suspense>
);

export default BookClubDiscussionPage;