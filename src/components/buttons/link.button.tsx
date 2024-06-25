import { ReactNode } from 'react';
import Link from 'next/link';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';
import { ButtonProps } from '@nextui-org/react';

// Component props
interface LinkButtonProps extends ButtonProps {
  uri: string;
  tooltip: string;
  children: ReactNode;
}

/**
 * Icon button linking to a page
 *
 * @param {Object} props - The component's props
 * @param {string} props.uri - The URI to link to
 * @param {string} props.tooltip - The text to display in the tooltip
 * @param {React.ReactNode} props.children - The icon to display in the button
 */
const LinkButton = ({ uri, tooltip, children, ...buttonProps }: Readonly<LinkButtonProps>) => (
  <Tooltip
    className="bg-opacity-75 bg-black text-white"
    content={tooltip}
  >
    <Link href={uri}>
      <Button
        isIconOnly
        size="sm"
        color="secondary"
        aria-label={`${uri} button`}
        {...buttonProps}
      >
        {children}
      </Button>
    </Link>
  </Tooltip>
);

export default LinkButton;
