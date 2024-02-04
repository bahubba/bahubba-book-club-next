'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';

// Component props
interface SubmitButtonProps {
  buttonText?: string;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  buttonIcon?: React.ReactNode;
  disabled?: boolean;
}

/**
 * Submit button for forms
 *
 * @param {Object} props - Component props
 * @param {string} props.buttonText - Text to display on the button
 */
const SubmitButton = ({
  buttonText = 'Submit',
  color = 'secondary',
  buttonIcon,
  disabled = false
}: Readonly<SubmitButtonProps>) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      color={disabled ? 'default' : color}
      isIconOnly={!!buttonIcon}
      disabled={disabled || pending}
    >
      {pending ? <Spinner /> : buttonIcon ?? buttonText}
    </Button>
  );
};

export default SubmitButton;
