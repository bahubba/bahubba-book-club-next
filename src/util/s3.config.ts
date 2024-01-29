import { S3Client } from '@aws-sdk/client-s3';

/** S3 Client */
export const s3Client = new S3Client({
  region: process.env.BBCM_AWS_REGION
});
