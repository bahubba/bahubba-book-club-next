import RequestMembershipForm from '@/components/forms/request-membership.form';

// Page props
interface BookClubAdminMembersPageProps {
  params: {
    bookClubSlug: string;
  };
}

/**
 * Page for requesting membership in a book club
 *
 * @param {Object} props Component props
 * @param {Object} props.params The parameters of the page
 * @param {string} props.params.bookClubSlug The slug of the book club
 */
const RequestMembershipPage = ({
  params: { bookClubSlug }
}: Readonly<BookClubAdminMembersPageProps>) => (
  <div className="flex flex-col gap-2 min-w-[50%] max-w-[75%] h-screen">
    <h1 className="text-2xl font-bold">Create Book Club</h1>
    <RequestMembershipForm bookClubSlug={bookClubSlug} />
  </div>
);

export default RequestMembershipPage;
