import { MongoClient } from 'mongodb';

import props from '@/util/properties';

// MongoDB atlas connection
const client = new MongoClient(props.DB.ATLAS_URI);

/** Connect to MongoDB Atlas if not already connected */
const connectMongo = async () => {
  await client.connect();
  return client.db(props.DB.ATLAS_DB);
};

export default connectMongo;
