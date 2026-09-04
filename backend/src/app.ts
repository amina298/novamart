import express, { Request, Response } from "express";
import cors from "cors";
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


const app = express();

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

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Novamart API is running 🚀",
  });
});

export default app;