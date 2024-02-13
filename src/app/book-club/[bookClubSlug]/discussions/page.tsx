import { Suspense } from 'react';
import { ScrollShadow } from '@nextui-org/scroll-shadow';

import { getAdHocDiscussions } from '@/api/fetchers/discussion.fetchers';
import DiscussionCard from '@/components/cards/discussion.card';

/**
 * Async component for loading book club discussion cards
 *
 * @prop {Object} props - Component props
 * @prop {string} props.bookClubSlug - The slug of the book club
 */
const DiscussionCards = async ({ bookClubSlug }: { bookClubSlug: string }) => {
  // Load the discussions
  const discussions = await getAdHocDiscussions(bookClubSlug);

  return (
    <>
      {discussions.map(discussion => (
        <>
          <DiscussionCard
            key={discussion.title}
            discussion={discussion}
          />
        </>
      ))}
    </>
  );
};

/**
 * Book club discussions home page
 *
 * @prop {Object} props - Component props
 * @prop {Object} props.params - The route parameters
 * @prop {string} props.params.bookClubSlug - The slug of the book club
 */
const BookClubDiscussionsPage = ({
  params: { bookClubSlug }
}: Readonly<{ params: { bookClubSlug: string } }>) => (
  <>
    <h1 className="flex-shrink text-2xl font-bold my-2">Discussions</h1>
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
