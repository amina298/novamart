import { Request, Response } from "express";
import Order from "../../models/orderModel";
import OrderItem from "../../models/orderItemModel";
import Product from "../../models/productModel";

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
            },
          ],
        },
      ],
    });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      message: "Failed to get all orders.",
    });
  }
};