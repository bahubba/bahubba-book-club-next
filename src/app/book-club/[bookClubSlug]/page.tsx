// Component props
interface BookClubHomePageProps {
  params: {
    bookClubSlug: string;
  };
}

/**
 * Book club home page
 *
 * @param props - Page props
 * @param props.params - Page params
 * @param props.params.bookClubSlug - Slug of the book club name from the URL path
 */
const BookClubHomePage = ({
  params: { bookClubSlug }
}: Readonly<BookClubHomePageProps>) => {
  // TODO - Fetch book club and get name for title from there, not slug
  return (
    <>
      <h1 className="text-2xl font-bold">{bookClubSlug}</h1>
    </>
  );
};

export default BookClubHomePage;
