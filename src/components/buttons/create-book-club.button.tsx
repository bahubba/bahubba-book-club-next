import Link from 'next/link';
import { Tooltip } from '@nextui-org/tooltip';
import { Button } from '@nextui-org/button';

import PlusIcon from '@/components/icons/plus.icon';

/** Button linking to the create book club page */
const CreateBookClubButton = () =>
  <Tooltip className="bg-opacity-75 bg-black text-white" content="Create a book club">
    <Link href="/book-club/create">
      <Button isIconOnly size="sm" color="secondary" aria-label="Create book club">
        <PlusIcon/>
      </Button>
    </Link>
  </Tooltip>;

export default CreateBookClubButton;