import { Suspense } from 'react';

import { getDiscussion } from '@/api/fetchers/discussion.fetchers';

// Component props
interface Slugs {
  bookClubSlug: string;
  discussionSlug: string;
}

interface BookClubDiscussionPageProps {
  params: Slugs;
}

/**
 * Async component for the book club discussion header
 *
 * @prop {Object} props - Component props
 * @prop {string} props.bookClubSlug - The slug of the book club
 * @prop {string} props.discussionSlug - The slug of the discussion
 */
const BookClubDiscussionHeader = async ({
  bookClubSlug,
  discussionSlug
}: Readonly<Slugs>) => {
  // Load the discussion
  const discussion = await getDiscussion(bookClubSlug, discussionSlug);

  return (
    <>
      <h1 className="text-2xl font-bold my-2">{discussion.title}</h1>
      <p className="text-gray-500">{discussion.description}</p>
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
  params: { bookClubSlug, discussionSlug }
}: Readonly<BookClubDiscussionPageProps>) => {
  return (
    <>
      <Suspense fallback={<></>}>
        <BookClubDiscussionHeader
          bookClubSlug={bookClubSlug}
          discussionSlug={discussionSlug}
        />
      </Suspense>
    </>
  );
};

export default BookClubDiscussionPage;
