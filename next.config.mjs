/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `${ process.env.BBCM_AWS_S3_BUCKET }.s3.us-east-1.amazonaws.com`
      }
    ]
  }
};

export default nextConfig;
