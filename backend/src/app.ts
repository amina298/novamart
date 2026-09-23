import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

import userRoutes from "./routes/User";
import loginRoutes from "./routes/Login";
import productRoutes from "./routes/productRoute";
import categoryRoutes from "./routes/categoryRoute";
import cartRoutes from "./routes/cartRoute";
import orderRoutes from "./routes/orderRoute";
import adminOrderRoutes from "./admin/routes/adminOrderRoute";
import adminProductRoutes from "./admin/routes/adminProductRoute";
import adminUserRoutes from "./admin/routes/adminUserRoute";
import paymentRoutes from "./routes/paymentRoute";
import adminPaymentRoutes from "./admin/routes/adminPaymentRoute";
import reviewRoutes from "./routes/reviewRoute";
import wishlistRoutes from "./routes/wishlistRoute";
import errorHandler from "./middleware/errorHandler";


const app = express();
app.use(helmet());

app.get("/test-jwt", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      {
        algorithms: ["HS256"],
      }
    );

    return res.status(200).json({
      message: "Signature is valid.",
      decoded,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Signature verification failed.",
    });
  }
});



app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/payments", paymentRoutes);
app.use(
  "/api/admin/payments",
  adminPaymentRoutes
);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Novamart API is running 🚀",
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;