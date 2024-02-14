import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';

import { DiscussionProperties } from '@/db/models/nodes';

/**
 * Card display for book club discussions
 *
 * @prop {Object} props - Component props
 * @prop {DiscussionProperties} props.discussion - Discussion
 * @prop {string} props.bookClubSlug - The slug of the book club
 */
const DiscussionCard = ({
  discussion,
  bookClubSlug
}: Readonly<{ discussion: DiscussionProperties; bookClubSlug: string }>) => (
  <Link href={`/book-club/${bookClubSlug}/discussions/${discussion.slug}`}>
    <Card className="w-full border-2 border-gray-200">
      <CardHeader className="flex-col items-start">
        <h1 className="text-xl">{discussion.title}</h1>
        <small>{discussion.description}</small>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>Replies/content goes here</p>
      </CardBody>
    </Card>
  </Link>
);

export default DiscussionCard;
