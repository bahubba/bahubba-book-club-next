import { Suspense } from 'react';

import { getDiscussion } from '@/api/fetchers/discussion.fetchers';
import ReplyButton from '@/components/buttons/reply.button';

// Component props
interface Slugs {
  bookClubSlug: string;
  discussionID: string;
}

interface BookClubDiscussionPageProps {
  params: Slugs;
}

/**
 * Async component for the book club discussion header
 *
 * @prop {Object} props - Component props
 * @prop {string} props.bookClubSlug - The slug of the book club
 * @prop {string} props.discussionID - The slug of the discussion
 */
const BookClubDiscussionHeader = async ({
  bookClubSlug,
  discussionID
}: Readonly<Slugs>) => {
  // Load the discussion
  const discussion = await getDiscussion(bookClubSlug, discussionID);

  return (
    <>
      <h1 className="text-2xl font-bold my-2">{discussion.title}</h1>
      <p className="text-gray-500">{discussion.description}</p>
      <div className="flex justify-end w-full">
        <ReplyButton
          bookClubSlug={bookClubSlug}
          discussionID={discussionID}
          nodeID={discussionID}
          replyToText={discussion.description ?? discussion.title}
          rootReply
        />
      </div>
    </>
  );
};

/**
 * Book club discussion page
 *
 * @prop {Object} props - Component props
 * @prop {Object} props.params - The route parameters
 * @prop {string} props.params.bookClubSlug - The slug of the book club
 */
const BookClubDiscussionPage = ({
  params: { bookClubSlug, discussionID }
}: Readonly<BookClubDiscussionPageProps>) => {
  return (
    <>
      <Suspense fallback={<></>}>
        <BookClubDiscussionHeader
          bookClubSlug={bookClubSlug}
          discussionID={discussionID}
        />
      </Suspense>
    </>
  );
};

export default BookClubDiscussionPage;