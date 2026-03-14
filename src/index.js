import dotenv from "dotenv";
import {connectDB} from "./db/index.js";

dotenv.config({
    path: "./.env"
});

connectDB();














/*ANOTHER WAY TO CONNECT TO MONGODB USING EXPRESS SERVER. 
THIS IS AN ALTERNATIVE TO THE connectDB FUNCTION IN src/db.js. 
YOU CAN CHOOSE EITHER ONE BASED ON YOUR PREFERENCE. 
IF YOU USE THIS APPROACH, MAKE SURE TO REMOVE OR COMMENT OUT THE connectDB FUNCTION IN src/db.js TO AVOID DUPLICATE CONNECTIONS.
import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);

    app.on("error", (error) => {
      console.error("Error connecting to MongoDB:", error);
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();*/