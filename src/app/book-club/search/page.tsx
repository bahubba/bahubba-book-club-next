import BookClubSearchForm from '@/components/forms/book-club-search.form';

/** Search page for finding book clubs */
const SearchPage = () => (
  <div className="flex justify-center">
    <div className="flex flex-col gap-y-2 min-w-[50vw] max-w-[75vw] max-h-fill-below-header">
      <h1 className="flex-shrink text-2xl font-bold">Book Club Search</h1>
      <BookClubSearchForm/>
    </div>
  </div>
);

export default SearchPage;
