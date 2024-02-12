import Link from 'next/link';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';

// Component props
interface LinkButtonProps {
  uri: string;
  tooltip: string;
  children: React.ReactNode;
}

/**
 * Icon button linking to a page
 *
 * @prop {Object} props - The component's props
 * @prop {string} props.uri - The URI to link to
 * @prop {string} props.tooltip - The text to display in the tooltip
 * @prop {React.ReactNode} props.children - The icon to display in the button
 */
const LinkButton = ({ uri, tooltip, children }: Readonly<LinkButtonProps>) => (
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
      >
        {children}
      </Button>
    </Link>
  </Tooltip>
);

export default LinkButton;
