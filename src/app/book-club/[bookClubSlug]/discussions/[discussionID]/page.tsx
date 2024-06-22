import { Suspense } from 'react';

import { getDiscussion } from '@/api/fetchers/discussion.fetchers';
import DiscussionReplyList from '@/components/lists/discussion-reply.list';
import { Spinner } from '@nextui-org/spinner';
import BookClubBackButton from '@/components/buttons/book-club-back.button';

// Component props
interface BookClubDiscussionPageProps {
  params: {
    bookClubSlug: string;
    discussionID: string;
  };
  searchParams?: {
    pageNum?: string;
    pageSize?: string;
  }
}

/**
 * Book club discussion page
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - The route parameters
 * @param {string} props.params.bookClubSlug - The slug of the book club
 */
const BookClubDiscussionPage = async ({
  params: { bookClubSlug, discussionID },
  searchParams: {
    pageNum = '1',
    pageSize = '10'
  } = {
    pageNum: '1',
    pageSize: '10'
  }
}: Readonly<BookClubDiscussionPageProps>) => {
  // Load the discussion
  const discussion = await getDiscussion(bookClubSlug, discussionID);

  return (
    <>
      <div className="flex-shrink flex-grow-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold my-2">{discussion.title}</h1>
            <p className="text-gray-500">{discussion.description}</p>
          </div>
          <BookClubBackButton bookClubSlug={bookClubSlug} />
        </div>
      </div>
      <div className="flex flex-1 flex-col w-full h-1">
        <Suspense
          fallback={
            <div className="flex justify-center items-center w-full h-full">
              <Spinner/>
            </div>
          }
        >
          <DiscussionReplyList
            bookClubSlug={bookClubSlug}
            discussionID={discussionID}
            pageNum={parseInt(pageNum)}
            pageSize={parseInt(pageSize)}
          />
        </Suspense>
      </div>
    </>
  );
};

export default BookClubDiscussionPage;