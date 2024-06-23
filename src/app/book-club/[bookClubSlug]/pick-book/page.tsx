import { Divider } from '@nextui-org/divider';

import BookClubHeader from '@/components/data-fetchers/book-club-name.data-fetcher';

// Component props
interface PickBookPageProps {
  params: {
    bookClubSlug: string;
  }
}

/**
 * Page for picking a book club
 *
 * @param {Object} props Component props
 * @param {Object} props.params URL slugs as params
 * @param {string} props.params.bookClubSlug The slug of the book club being picked for
 */
const PickBookPage = ({ params: { bookClubSlug } }: PickBookPageProps) => (
  <div className="flex flex-col h-full pb-2">
    <div className="flex-shrink flex-grow-0 flex justify-between items-center">
      <h1 className="ms-2 my-2 text-3xl font-bold">
        <BookClubHeader
          bookClubSlug={bookClubSlug}
          prefix="Pick for "
        />
      </h1>
    </div>
    <div className="flex-shrink flex-grow-0 flex justify-center">
      
    </div>
    <Divider className="flex-shrink flex-grow-0 my-2" />
  </div>
);

export default PickBookPage;