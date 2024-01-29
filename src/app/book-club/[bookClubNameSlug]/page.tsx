/**
 * Book club home page
 */
const BookClubHomePage = ({ params }: { params: { bookClubNameSlug: string } }) => {
  // TODO - Fetch book club and get name for title from there, not slug
  return <>
    <h1 className="text-2xl font-bold">{ params.bookClubNameSlug }</h1>
  </>;
};

export default BookClubHomePage;