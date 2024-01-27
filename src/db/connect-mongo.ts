import mongoose from 'mongoose';

import props from '@/util/properties';

// MongoDB atlas connection status
let isConnected: boolean;

/** Connect to MongoDB Atlas if not already connected */
const connectMongo = async () => {
  // If already connected, re-use the existing connection
  if (isConnected) {
    console.log('Re-using existing MongoDB connection');
    return;
  }

  // If not already connected, connect to MongoDB Atlas
  await mongoose.connect(props.DB.ATLAS_URI);
  isConnected = true;
  console.log('Connected to MongoDB Atlas');
};

export default connectMongo;
