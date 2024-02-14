interface Props {
  APP: { [key: string]: string | string[] };
  DB: { [key: string]: string };
  AWS: { [key: string]: string | number };
}

/** Properties for the application */
const props: Props = {
  APP: {
    NAME: process.env.BBCM_APP_NAME || 'BAHubba Book Club Manager',
    RESERVED_CLUB_NAMES: ['', '_', 'create', 'search', 'default'],
    RESERVED_DISCUSSION_NAMES: ['', '_', 'create', 'search', 'default'],
    DEFAULT_BOOK_CLUB_DESCRIPTION: 'A book club for reading books'
  },
  DB: {
    ATLAS_URI: `mongodb+srv://${process.env.BBCM_ATLAS_USER}:${process.env.BBCM_ATLAS_PW}@${process.env.BBCM_ATLAS_URI}`,
    ATLAS_DB: process.env.BBCM_ATLAS_DB || 'bbcm',
    ATLAS_USER_COLLECTION: process.env.BBCM_ATLAS_USER_COLLECTION || 'users',
    ATLAS_BOOK_CLUB_COLLECTION:
      process.env.BBCM_ATLAS_BOOK_CLUB_COLLECTION || 'book-clubs',
    AURA_URI: process.env.BBCM_AURA_URI || 'bolt://localhost:7687',
    AURA_USERNAME: process.env.BBCM_AURA_USERNAME || 'neo4j',
    AURA_PW: process.env.BBCM_AURA_PW || ''
  },
  AWS: {
    S3_PRE_SIGNED_URL_EXPIRATION:
      process.env.BBCM_AWS_S3_PRE_SIGNED_URL_EXPIRATION || 60 * 5 // 5 minutes
  }
};

export default props;
