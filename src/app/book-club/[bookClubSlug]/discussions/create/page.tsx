import DiscussionForm from '@/components/forms/discussion.form';
import BookClubBackButton from '@/components/buttons/book-club-back.button';

/**
 * Page for creating a new discussion
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - The route parameters
 * @param {string} props.params.bookClubSlug - The slug of the book club
 */
const CreateDiscussionPage = ({
  params: { bookClubSlug }
}: Readonly<{ params: { bookClubSlug: string } }>) => (
  <div className="min-w-[50vw]">
    <div className="flex justify-between items-center">
      <h1 className="flex-shrink text-2xl font-bold">
        Start New Book Club Discussion
      </h1>
      <BookClubBackButton bookClubSlug={bookClubSlug} />
    </div>
    <DiscussionForm bookClubSlug={bookClubSlug} />
  </div>
);

export default CreateDiscussionPage;
