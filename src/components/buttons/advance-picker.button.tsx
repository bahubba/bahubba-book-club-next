import { useFormState } from 'react-dom';
import { Input } from '@nextui-org/input';

import { handleAdvancePicker } from '@/api/form-handlers/book-club.form-handlers';
import SubmitButton from './submit.button';

/**
 * Button (and form) for advancing the current picker in a book club
 *
 * @param {Object} props - The component's props
 * @param {string} props.bookClubSlug - The slug of the book club
 * @param {Role} props.memberRole - The role of the current user
 * @param {boolean} props.inAdminPage - Whether the button is in the admin page
 */
const AdvancePickerButton = ({
  bookClubSlug,
  inAdminPage = false
}: Readonly<{
  bookClubSlug: string;
  inAdminPage?: boolean;
}>) => {
  // Form state
  const [formState, formAction] = useFormState(handleAdvancePicker, {
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
        name="pageRoute"
        value={
          inAdminPage
            ? `/book-club/${bookClubSlug}/admin/pick-order`
            : `/book-club/${bookClubSlug}`
        }
      />
      <SubmitButton buttonText="Advance Picker" />
    </form>
  );
};

export default AdvancePickerButton;
