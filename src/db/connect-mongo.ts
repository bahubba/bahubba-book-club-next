import { Collection, Db, MongoClient } from 'mongodb';

import props from '@/util/properties';

// MongoDB atlas connection
let client: MongoClient,
  db: Db | undefined,
  collectionMap: Map<string, Collection> = new Map();

/** Connect to MongoDB Atlas if not already connected */
const connectMongo = async () => {
  // Connect to the database if not already connected
  if (!client) {
    client = await new MongoClient(props.DB.ATLAS_URI);
    db = undefined;
  }
  if (!db) {
    await client.connect();
    return client.db(props.DB.ATLAS_DB);
  }

  return db;
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
  if (collectionMap.has(collectionName)) {
    const collection = collectionMap.get(collectionName);
    if (collection) return collection;
  }

  const db = await connectMongo();
  collectionMap.set(collectionName, db.collection(collectionName));
  return db.collection(collectionName);
};

export default connectMongo;
