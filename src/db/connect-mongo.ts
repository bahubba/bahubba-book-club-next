import mongoose from "mongoose";

import props from "@/util/properties";

const connectMongo = async ()=> mongoose.connect(props.DB.ATLAS_URI);

export default connectMongo;