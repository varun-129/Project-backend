import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
    console.log(`\nConnected to MongoDB !! DB Host: ${connectionInstance.connection.host}\n DB Name: ${connectionInstance.connection.name}\n`);
  } catch (error) {
    console.log("MongoDB connection FAILED 1", error);
    process.exit(1); // Exit the process with an error code
  }
};

 