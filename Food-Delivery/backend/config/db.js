import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    console.log("📍 Environment:", process.env.NODE_ENV || "development");
    
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ DB Connected Successfully");
    console.log("📍 Database State:", mongoose.connection.readyState);
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    console.error("🔍 Full Error:", error);
    
    // Don't exit in production, let Render handle restarts
    if (process.env.NODE_ENV === "production") {
      console.log("🔄 Production mode: Will retry connection...");
      setTimeout(connectDB, 5000); // Retry after 5 seconds
    } else {
      process.exit(1);
    }
  }
};
