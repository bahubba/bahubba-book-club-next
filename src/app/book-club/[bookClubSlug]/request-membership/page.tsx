import RequestMembershipForm from '@/components/forms/request-membership.form';
import BookClubBackButton from '@/components/buttons/book-club-back.button';

// Page props
interface BookClubAdminMembersPageProps {
  params: {
    bookClubSlug: string;
  };
}

/**
 * Page for requesting membership in a book club
 * FIXME - Layout is all screwed up; justified left
 *
 * @param {Object} props Component props
 * @param {Object} props.params The parameters of the page
 * @param {string} props.params.bookClubSlug The slug of the book club
 */
const RequestMembershipPage = ({
  params: { bookClubSlug }
}: Readonly<BookClubAdminMembersPageProps>) => (
  <div className="flex flex-col gap-2 min-w-[50%] max-w-[75%] h-screen">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Create Book Club</h1>
      <BookClubBackButton bookClubSlug={bookClubSlug} />
    </div>
    <RequestMembershipForm bookClubSlug={ bookClubSlug }/>
  </div>
);

    export default RequestMembershipPage;
