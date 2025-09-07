import mongoose from "mongoose";

let connected = false;

const connectDB = async function () {
  mongoose.set("strictQuery", true);

  if (connected) {
    console.log("mongoDB is already connected");
    return;
  }
  105.25;
  const dbUrl = process.env.MONGODB_URI;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }

  try {
    await mongoose.connect(dbUrl);
    connected = true;
    console.log("mongodb is connected");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
