import { redirect } from 'next/navigation';

/**
 * Unused page; redirects to the details sub-page
 *
 * @param {Object} props - The component props
 * @param {Object} props.params - The page params
 * @param {string} props.params.bookClubSlug - The slug of the book club
 */
const BookClubAdminPage = ({
                             params: { bookClubSlug }
                           }: Readonly<{ params: { bookClubSlug: string } }>) => {
  // Redirect to the details sub-page
  redirect(`/book-club/${ bookClubSlug }/admin/details`);

  // Unreachable but necessary
  return <></>;
};

export default BookClubAdminPage;
