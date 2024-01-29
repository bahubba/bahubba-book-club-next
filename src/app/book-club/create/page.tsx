import BookClubDetailsForm from '@/components/forms/book-club-details.form';

/** The create book club page */
const CreateBookClubPage = () => {
  return (
    <>
      <h1 className="text-2xl font-bold">Create Book Club</h1>
      <BookClubDetailsForm/>
    </>
  );
};

export default CreateBookClubPage;