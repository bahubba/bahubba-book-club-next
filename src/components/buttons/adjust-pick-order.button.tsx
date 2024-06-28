import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';

import SubmitButton from './submit.button';
import { handleAdjustPickOrder } from '@/api/form-handlers/membership.form-handlers';

// Component props
interface AdjustPickOrderButtonProps {
  bookClubSlug: string;
  pickOrder: string[];
  inAdminPage?: boolean;
}

/**
 * Button (and form) for adjusting the pick order of a book club
 *
 * @param {Object} props - Component props
 * @param {string} props.bookClubSlug - The slug of the book club
 * @param {string[]} props.pickOrder - The new pick order
 * @param {boolean} props.inAdminPage - Whether the button is in the admin page
 */
const AdjustPickOrderButton = ({
  bookClubSlug,
  pickOrder,
  inAdminPage = false
}: Readonly<AdjustPickOrderButtonProps>) => {
  const [formState, formAction] = useFormState(handleAdjustPickOrder, {
    error: ''
  });

  return (
    <form action={formAction}>
      <Input
        className="hidden"
        name="slug"
        value={bookClubSlug}
      />
      <Input
        className="hidden"
        name="order"
        value={JSON.stringify(pickOrder)}
      />
      <Input
        className="hidden"
        name="pageRoute"
        value={
          inAdminPage
            ? `/book-club/${bookClubSlug}/admin/pick-order`
            : `/book-club/${bookClubSlug}`
        }
      />
      <SubmitButton buttonText="Adjust Pick Order" />
    </form>
  );
};

export default AdjustPickOrderButton;
