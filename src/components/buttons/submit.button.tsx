'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/button';

// Component props
interface SubmitButtonProps {
  buttonText: string;
  disabled: boolean;
}

/**
 * Submit button for forms
 *
 * @param {Object} props - Component props
 * @param {string} props.buttonText - Text to display on the button
 */
const SubmitButton = ({
  buttonText,
  disabled
}: Readonly<SubmitButtonProps>) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      color={disabled ? 'default' : 'secondary'}
      disabled={disabled || pending}
    >
      {pending ? 'Submitting...' : buttonText}
    </Button>
  );
};

export default SubmitButton;
