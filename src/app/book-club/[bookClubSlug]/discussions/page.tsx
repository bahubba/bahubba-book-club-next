import { Suspense } from 'react';
import { ScrollShadow } from '@nextui-org/scroll-shadow';

import { getAdHocDiscussions } from '@/api/fetchers/discussion.fetchers';
import DiscussionCard from '@/components/cards/discussion.card';
import BookClubBackButton from '@/components/buttons/book-club-back.button';

/**
 * Async component for loading book club discussion cards
 *
 * @param {Readonly<{ bookClubSlug: string }>} props Component props
 * @param {string} props.bookClubSlug The slug of the book club
 */
const DiscussionCards = async ({ bookClubSlug }: Readonly<{ bookClubSlug: string }>) => {
  // Load the discussions
  const discussions = await getAdHocDiscussions(bookClubSlug);

  return (
    <>
      {discussions.map(discussion => (
        <>
          <DiscussionCard
            key={discussion.title}
            discussion={discussion}
            bookClubSlug={bookClubSlug}
          />
        </>
      ))}
    </>
  );
};

/**
 * Book club discussions home page
 *
 * @param {Readonly<{ params: { bookClubSlug: string } }>} props Component props
 * @param {{ bookClubSlug: string }} props.params The route parameters
 * @param {string} props.params.bookClubSlug The slug of the book club
 */
const BookClubDiscussionsPage = ({ params: { bookClubSlug } }: Readonly<{ params: { bookClubSlug: string } }>) => (
  <>
    <div className="flex justify-between items-center pe-2">
      <h1 className="flex-shrink text-2xl font-bold my-2">Discussions</h1>
      <BookClubBackButton bookClubSlug={bookClubSlug} />
    </div>
    <ScrollShadow
      size={100}
      className="flex-1 overflow-y-auto space-y-2 p-1 rounded-lg"
      hideScrollBar
    >
      <Suspense fallback={<></>}>
        <DiscussionCards bookClubSlug={bookClubSlug} />
      </Suspense>
    </ScrollShadow>
  </>
);

export default BookClubDiscussionsPage;
