import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "./models/userModel.js";
import foodModel from "./models/foodModel.js";
import dotenv from "dotenv";

dotenv.config();

const setupDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected");

    // 1. Create admin user
    const existingAdmin = await userModel.findOne({ email: "wizard7@gmail.com" });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash("wizGoFood2004", salt);

      const admin = new userModel({
        name: "Wizard Admin",
        email: "wizard7@gmail.com",
        password: hashedPassword,
        role: "admin"
      });

      await admin.save();
      console.log("✅ Admin created: wizard7@gmail.com");
    } else {
      console.log("✅ Admin already exists");
    }

    // 2. Add sample foods
    const sampleFoods = [
      {
        name: "Margherita Pizza",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil",
        price: 12.99,
        category: "Salad", // Using existing category
        image: "pizza_01.jpg"
      },
      {
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with parmesan cheese and croutons",
        price: 8.99,
        category: "Salad",
        image: "salad_01.jpg"
      },
      {
        name: "Chicken Burger",
        description: "Juicy grilled chicken patty with lettuce and special sauce",
        price: 10.99,
        category: "Rolls",
        image: "burger_01.jpg"
      },
      {
        name: "Chocolate Cake",
        description: "Rich chocolate cake with creamy frosting",
        price: 6.99,
        category: "Cake",
        image: "cake_01.jpg"
      },
      {
        name: "Pasta Carbonara",
        description: "Creamy pasta with bacon and parmesan cheese",
        price: 11.99,
        category: "Pasta",
        image: "pasta_01.jpg"
      },
      {
        name: "Veg Sandwich",
        description: "Fresh vegetables with cheese on toasted bread",
        price: 7.99,
        category: "Sandwich",
        image: "sandwich_01.jpg"
      },
      {
        name: "Noodles Soup",
        description: "Warm noodle soup with fresh vegetables",
        price: 9.99,
        category: "Noodles",
        image: "noodles_01.jpg"
      },
      {
        name: "Ice Cream Sundae",
        description: "Vanilla ice cream with chocolate sauce and toppings",
        price: 5.99,
        category: "Deserts",
        image: "desert_01.jpg"
      }
    ];

    // Check if foods exist
    const existingFoods = await foodModel.find({});
    if (existingFoods.length === 0) {
      // Add sample foods
      for (const food of sampleFoods) {
        const newFood = new foodModel(food);
        await newFood.save();
      }
      console.log(`✅ Added ${sampleFoods.length} sample food items`);
    } else {
      console.log(`✅ ${existingFoods.length} foods already exist`);
    }

    console.log("\n🎉 Database setup complete!");
    console.log("📧 Admin Login: wizard7@gmail.com");
    console.log("🔑 Admin Password: wizGoFood2004");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

setupDatabase();
