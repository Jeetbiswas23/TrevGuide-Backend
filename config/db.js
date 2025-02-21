import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Please ensure:');
    console.log('1. Your .env file exists with MONGODB_URI');
    console.log('2. Your IP address is whitelisted in MongoDB Atlas');
    console.log('3. Your credentials are correct');
    
    if (process.env.MONGODB_URI) {
      console.log(`Connection string used: ${process.env.MONGODB_URI.replace(/:([^:@]{8,}@)/g, ':****@')}`);
    }
    
    // Exit with failure if this is production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;
