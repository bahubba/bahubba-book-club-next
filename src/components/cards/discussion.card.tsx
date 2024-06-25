import { Fragment } from 'react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';

import { DiscussionPreview } from '@/db/models/nodes';
import { User } from '@nextui-org/user';

/**
 * Card display for book club discussions
 *
 * @param {Object} props Component props
 * @param {DiscussionProperties} props.discussion Discussion
 * @param {string} props.bookClubSlug The slug of the book club
 */
const DiscussionCard = ({
                          discussion,
                          bookClubSlug
                        }: Readonly<{ discussion: DiscussionPreview; bookClubSlug: string }>) => (
  <Link href={ `/book-club/${ bookClubSlug }/discussions/${ discussion.id }` }>
    <Card className="w-full border-2 border-gray-200">
      <CardHeader className="flex-col items-start">
        <h3 className="text-lg font-bold">{ discussion.title }</h3>
        <small className="italic">{ discussion.description }</small>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex-col space-y-1">
          {
            discussion.replies.map((reply, idx) => (
              <Fragment key={ reply.id }>
                <div className="w-full flex-col space-y-0.5">
                  <div className="text-medium">{ reply.content }</div>
                  <User
                    name={ reply.user.preferredName }
                    avatarProps={ {
                      src: reply.user.preferredImage || undefined,
                      alt: `${ reply.user.preferredName || 'user' } avatar`,
                      size: 'sm'
                    } }
                  />
                </div>
                { idx < discussion.replies.length - 1 && <Divider /> }
              </Fragment>
            ))
          }
        </div>
      </CardBody>
    </Card>
  </Link>
);

export default DiscussionCard;
