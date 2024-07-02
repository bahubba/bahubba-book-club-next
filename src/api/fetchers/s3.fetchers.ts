'use server';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '@/util/s3.config';
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

import { ensureAuth } from '../auth.api';
import props from '@/util/properties';

/**
 * Retrieve a pre-signed URL for a given image name
 *
 * @param {string} imageName Name of the image to generate link for
 * @return {Promise<string>} Pre-signed URL for the image with a relatively quick expiration
 */
export const getPreSignedBookClubImageURL = async (imageName: string): Promise<string> => {
  // Ensure that the user is authenticated
  await ensureAuth();

  // Generate a pre-signed URL for the given image name
  const imageURL = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: process.env.BBCM_AWS_S3_BUCKET,
      Key: `${process.env.BBCM_AWS_S3_BOOK_CLUB_IMAGE_PATH}${imageName}`
    }),
    { expiresIn: props.AWS.S3_PRE_SIGNED_URL_EXPIRATION as number }
  );

  return imageURL;
};

/**
 * Retrieves a list of stock book club image file names
 *
 * @return {Promise<string[]>} List of pre-signed URLs for internal images for book clubs stored in S3
 */
export const getStockBookClubImageNames = async (): Promise<string[]> => {
  // Ensure that the user is authenticated
  await ensureAuth();

  // List all stock book club images
  const { Contents: imageList } = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: process.env.BBCM_AWS_S3_BUCKET,
      Prefix: process.env.BBCM_AWS_S3_STOCK_BOOK_CLUB_IMAGE_PATH
    })
  );

  // Return a list of stock book club image names
  return imageList
    ? imageList
        .filter(image => image.Size && image.Size > 0)
        .map(image => image.Key?.split('/').pop() as string)
    : [];
};
