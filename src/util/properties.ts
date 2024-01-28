interface Props {
  APP: { [key: string]: string | string[] };
  DB: { [key: string]: string };
}

/** Properties for the application */
const props: Props = {
  APP: {
    NAME: process.env.BBCM_APP_NAME || 'BAHubba Book Club Manager',
    RESERVED_CLUB_NAMES: [ 'create' ],
  },
  DB: {
    ATLAS_URI: `mongodb+srv://${ process.env.BBCM_ATLAS_USER }:${ process.env.BBCM_ATLAS_PW }@${ process.env.BBCM_ATLAS_URI }`,
    ATLAS_DB: process.env.BBCM_ATLAS_DB || 'bbcm',
    ATLAS_USER_COLLECTION: process.env.BBCM_ATLAS_USER_COLLECTION || 'users',
    ATLAS_BOOK_CLUB_COLLECTION: process.env.BBCM_ATLAS_BOOK_CLUB_COLLECTION || 'book-clubs',
  }
};

export default props;
