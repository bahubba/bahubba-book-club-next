// Component props
interface BookClubHomePageProps {
  params: {
    bookClubNameSlug: string;
  };
}

/**
 * Book club home page
 *
 * @param props - Page props
 * @param props.params - Page params
 * @param props.params.bookClubNameSlug - Slug of the book club name from the URL path
 */
const BookClubHomePage = ({
  params: { bookClubNameSlug }
}: Readonly<BookClubHomePageProps>) => {
  // TODO - Fetch book club and get name for title from there, not slug
  return (
    <>
      <h1 className="text-2xl font-bold">{bookClubNameSlug}</h1>
    </>
  );
};

export default BookClubHomePage;
