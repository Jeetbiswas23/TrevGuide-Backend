import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error('MONGODB_URL is not defined in environment variables');
    }
    
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Connection string used:', process.env.MONGODB_URL?.replace(/:[^:/@]+@/, ':****@'));
    process.exit(1);
  }
};

export default connectDB;
