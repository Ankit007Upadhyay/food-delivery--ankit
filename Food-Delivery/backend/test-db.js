import mongoose from 'mongoose';

const MONGO_URL = 'mongodb+srv://ankityay007_db_user:sOfTOLtdk5IwgbUC@cluster0.mejm2ar.mongodb.net/foody?retryWrites=true&w=majority';

console.log('🔄 Testing MongoDB connection...');

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    console.log('📍 Database state:', mongoose.connection.readyState);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    process.exit(1);
  });
