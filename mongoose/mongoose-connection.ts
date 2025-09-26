import mongoose from "mongoose";
import chalk from "chalk";

export const connectMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log(chalk.green.bold("✅ Mongoose connection successful"));
  } catch (error) {
    console.log(
      chalk.red.bold("❌ Mongoose connection error:"),
      chalk.red(error)
    );
    console.log(chalk.yellow("⚠️ Connection Failed"));
  }
};
