interface Props {
  APP: { [key: string]: string };
  DB: { [key: string]: string };
}

/** Properties for the application */
const props: Props = {
  APP: {
    NAME: process.env.BBCM_APP_NAME || 'BAHubba Book Club Manager'
  },
  DB: {
    ATLAS_URI: `mongodb+srv://${ process.env.BBCM_ATLAS_USER }:${ process.env.BBCM_ATLAS_PW }@${ process.env.BBCM_ATLAS_URI }`
  }
};

export default props;
