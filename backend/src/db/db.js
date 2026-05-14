import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Database connected');

  } catch (error) {
    console.log("mongoDB Connection error : ", error);
    process.exit(1);
  }

}