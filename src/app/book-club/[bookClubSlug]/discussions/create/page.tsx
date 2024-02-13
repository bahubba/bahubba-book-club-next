import DiscussionForm from '@/components/forms/discussion.form';

/**
 * Page for creating a new discussion
 *
 * @prop {Object} props - Component props
 * @prop {Object} props.params - The route parameters
 * @prop {string} props.params.bookClubSlug - The slug of the book club
 */
const CreateDiscussionPage = ({
  params: { bookClubSlug }
}: Readonly<{ params: { bookClubSlug: string } }>) => (
  <>
    <h1 className="flex-shrink text-2xl font-bold">
      Start New Book Club Discussion
    </h1>
    <DiscussionForm bookClubSlug={bookClubSlug} />
  </>
);

export default CreateDiscussionPage;
