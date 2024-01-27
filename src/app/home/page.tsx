import PageSectionLayout from '@/components/layout/page-section.layout';

/** The home page for the application, showing a user's clubs, books, and trending info */
const HomePage = () => {
  return (
    <div className="flex w-full h-full pb-2">
      <PageSectionLayout header="Clubs">
        <div>Some long text string that will take up some width</div>
      </PageSectionLayout>
      <PageSectionLayout header="Books">
        <div>Some long text string that will take up some width</div>
      </PageSectionLayout>
      <PageSectionLayout header="Trending">
        <div>Some long text string that will take up some width</div>
      </PageSectionLayout>
    </div>
  );
};

export default HomePage;