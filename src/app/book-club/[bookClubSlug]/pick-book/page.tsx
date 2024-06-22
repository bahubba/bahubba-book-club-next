// Component props
import { Divider } from '@nextui-org/divider';

interface PickBookPageProps {
  params: {
    bookClubSlug: string;
  }
}

/**
 * Page for picking a book club
 *
 * @param {Object} props Component props
 * @param {Object} props.params URL slugs as params
 * @param {string} props.params.bookClubSlug The slug of the book club being picked for
 */
const PickBookPage = ({ params: { bookClubSlug } }: PickBookPageProps) => (
  <div className="flex justify-center">
    <div className="flex flex-col">
      <div>Search bar</div>
      <Divider />
      <div>Results</div>
      <Divider />
      <div>Submit button</div>
    </div>
  </div>
);

export default PickBookPage;