const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: process.env.MONGO_MAX_POOL_SIZE ? parseInt(process.env.MONGO_MAX_POOL_SIZE, 10) : 50,
      minPoolSize: process.env.MONGO_MIN_POOL_SIZE ? parseInt(process.env.MONGO_MIN_POOL_SIZE, 10) : 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongooseInstance) => {
      console.log(`✅ MongoDB connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`❌ MongoDB connection error: ${error.message}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;

