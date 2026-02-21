import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "./models/userModel.js";
import foodModel from "./models/foodModel.js";
import dotenv from "dotenv";

dotenv.config();

const setupDeployedDatabase = async () => {
  try {
    // Connect to deployed database
    await mongoose.connect("mongodb+srv://ankityay007_db_user:sOfTOLtdk5IwgbUC@cluster0.mejm2ar.mongodb.net/foody?retryWrites=true&w=majority");
    console.log("Connected to deployed database");

    // 1. Create admin user
    const existingAdmin = await userModel.findOne({ email: "wizard7@gmail.com" });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("wizGoFood2004", salt);

      const admin = new userModel({
        name: "Wizard Admin",
        email: "wizard7@gmail.com",
        password: hashedPassword,
        role: "admin"
      });

      await admin.save();
      console.log("✅ Admin created in deployed DB: wizard7@gmail.com");
    } else {
      console.log("✅ Admin already exists in deployed DB");
    }

    // 2. Add sample foods to deployed DB
    const sampleFoods = [
      {
        name: "Margherita Pizza",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil",
        price: 12.99,
        category: "Salad",
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

    const existingFoods = await foodModel.find({});
    if (existingFoods.length === 0) {
      for (const food of sampleFoods) {
        const newFood = new foodModel(food);
        await newFood.save();
      }
      console.log(`✅ Added ${sampleFoods.length} sample food items to deployed DB`);
    } else {
      console.log(`✅ ${existingFoods.length} foods already exist in deployed DB`);
    }

    console.log("\n🎉 Deployed database setup complete!");
    console.log("📧 Admin Login: wizard7@gmail.com");
    console.log("🔑 Admin Password: wizGoFood2004");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

setupDeployedDatabase();
