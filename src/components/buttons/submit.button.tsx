'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';

// Component props
interface SubmitButtonProps {
  buttonText?: string;
  size?: 'sm' | 'md' | 'lg' | undefined;
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
 * @param {string} props.buttonText - Text to display on the button if there is no icon
 * @param {'sm' | 'md' | 'lg' | undefined} props.size - The size of the button
 * @param {string} props.color - The color of the button
 * @param {React.ReactNode} props.buttonIcon - The icon to display on the button
 */
const SubmitButton = ({
  buttonText = 'Submit',
  size = 'md',
  color = 'secondary',
  buttonIcon,
  disabled = false
}: Readonly<SubmitButtonProps>) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size={size}
      color={disabled ? 'default' : color}
      isIconOnly={!!buttonIcon}
      disabled={disabled || pending}
    >
      {pending ? (
        <Spinner color={color === 'primary' ? 'secondary' : 'primary'} />
      ) : (
        buttonIcon ?? buttonText
      )}
    </Button>
  );
};

export default SubmitButton;
