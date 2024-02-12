import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Divider } from '@nextui-org/react';

import { DiscussionProperties } from '@/db/models/nodes';

/**
 * Card display for book club discussions
 *
 * @param {DiscussionProperties} discussion - Discussion
 */
const DiscussionCard = ({
  discussion
}: Readonly<{ discussion: DiscussionProperties }>) => (
  <Card className="w-full border-2 border-gray-200">
    <CardHeader className="flex-col items-start">
      <h1 className="text-xl">{discussion.title}</h1>
      <small>{discussion.description}</small>
    </CardHeader>
    <Divider />
    <CardBody>
      <p>Replies/content goes here</p>
    </CardBody>
    <Divider />
    <CardFooter>
      <p>Link to discussion page goes here</p>
    </CardFooter>
  </Card>
);

export default DiscussionCard;
