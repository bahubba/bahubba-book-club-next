import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';

import SubmitButton from './submit.button';
import { handleAdjustPickOrder } from '@/api/form-handlers/membership-form.handlers';

// Component props
interface AdjustPickOrderButtonProps {
  bookClubSlug: string;
  pickOrder: string[];
  inAdminPage?: boolean;
}

/**
 *
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
