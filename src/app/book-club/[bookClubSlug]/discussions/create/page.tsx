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
  <DiscussionForm bookClubSlug={bookClubSlug} />
);

export default CreateDiscussionPage;
