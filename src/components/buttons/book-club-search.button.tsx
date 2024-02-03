import Link from 'next/link';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';

import SearchIcon from '@/components/icons/search.icon';

/** Button linking to the create book club page */
const BookClubSearchButton = () => (
  <Tooltip
    className="bg-opacity-75 bg-black text-white"
    content="Search for book clubs"
  >
    <Link href="/book-club/search">
      <Button
        isIconOnly
        size="sm"
        color="secondary"
        aria-label="Book club search"
      >
        <SearchIcon />
      </Button>
    </Link>
  </Tooltip>
);

export default BookClubSearchButton;
