interface Props {
  DB: { [key: string]: string };
}

const props: Props = {
  DB: {
    ATLAS_URI: `mongodb+srv://${process.env.BBCM_ATLAS_USER}:${process.env.BBCM_ATLAS_PW}@bbcm.wpwjm9a.mongodb.net/`
  }
};

export default props;
