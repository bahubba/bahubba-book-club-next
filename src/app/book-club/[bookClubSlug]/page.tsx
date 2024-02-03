import RequestMembershipButton from '@/components/buttons/request-membership.button';
import PageSectionLayout from '@/components/layout/page-section.layout';

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
    <div className="flex w-full h-full pb-2">
      <PageSectionLayout
        header="Members"
        sectionHeaderChildren={
          <div className="flex gap-0.5">
            <RequestMembershipButton bookClubSlug={bookClubSlug} />
          </div>
        }
      >
        <span>Members go here</span>
      </PageSectionLayout>
      <PageSectionLayout header="Books">
        <div>Some long text string that will take up some width</div>
      </PageSectionLayout>
      <PageSectionLayout header="Discussions">
        <div>Some long text string that will take up some width</div>
      </PageSectionLayout>
    </div>
  );
};

export default BookClubHomePage;
