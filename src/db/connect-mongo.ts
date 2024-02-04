import { Collection, MongoClient } from 'mongodb';

import props from '@/util/properties';

// MongoDB atlas connection
const client = new MongoClient(props.DB.ATLAS_URI);
let connection: MongoClient;

/** Connect to MongoDB Atlas if not already connected */
const connectMongo = async () => {
  if (!connection) connection = await client.connect();
  return client.db(props.DB.ATLAS_DB);
};

/**
 * Connect to a collection in MongoDB Atlas
 *
 * @param {string} collectionName The name of the collection to connect to
 * @return {Promise<Collection<any>>} The collection
 */
export const connectCollection = async (
  collectionName: string
): Promise<Collection<any>> => {
  const db = await connectMongo();
  return db.collection(collectionName);
};

export default connectMongo;
