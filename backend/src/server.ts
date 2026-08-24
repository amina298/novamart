import dotenv from "dotenv";
import app from "./app";
import { connectDatabase, sequelize } from "./config/sequelize";

import "./models/User";
import "./models/productModel";
import "./models/cartModel";
import "./models/cartItemModel";
import "./models/orderModel";
import "./models/orderItemModel";
import "./models/association";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  // Synchronize all models with the database
  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();