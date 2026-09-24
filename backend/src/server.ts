import app from "./app";
import { connectDatabase, sequelize } from "./config/sequelize";
import { env } from "./config/env";

import "./models/User";
import "./models/productModel";
import "./models/cartModel";
import "./models/cartItemModel";
import "./models/orderModel";
import "./models/orderItemModel";
import "./models/paymentModel";
import "./models/reviewModel";
import "./models/association";

const PORT = env.PORT;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  await sequelize.sync();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();