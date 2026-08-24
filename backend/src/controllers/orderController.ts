import { Request, Response } from "express";
import Cart from "../models/cartModel";
import CartItem from "../models/cartItemModel";
import Product from "../models/productModel";
import Order from "../models/orderModel";
import OrderItem from "../models/orderItemModel";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
    const userId = req.user?.id;

     if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  try {
    // 1. Find the user's cart
    const cart = await Cart.findOne({
      where: { userId },
    });

    if (!cart) {
      res.status(404).json({
        message: "Cart not found.",
      });
      return;
    }

    // 2. Get all items in the cart
    const cartItems = await CartItem.findAll({
      where: {
        cartId: cart.id,
      },
    });

    if (cartItems.length === 0) {
      res.status(400).json({
        message: "Cart is empty.",
      });
      return;
    }

    // 3. Find the products for each cart item
    const products = await Promise.all(
      cartItems.map((item) => Product.findByPk(item.productId))
    );

    // 4. Check that all products exist
    if (products.some((product) => !product)) {
      res.status(404).json({
        message: "One or more products not found.",
      });
      return;
    }

    // 5. Calculate the order total
    let total = 0;

    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      const product = products[i];

      if (product) {
        total += Number(product.price) * item.quantity;
      }
    }

    // 6. Create the order
    const order = await Order.create({
      userId,
      total,
      status: "pending",
    });

    // 7. Create order items
    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    // 8. Clear the cart
    await CartItem.destroy({
      where: {
        cartId: cart.id,
      },
    });

    // 9. Return the created order
    res.status(201).json({
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Failed to create order.",
    });
  }
};




export const getOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  try {
    const orders = await Order.findAll({
      where: {
        userId,
      },
    });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Failed to get orders.",
    });
  }
};



export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  try {
    const order = await Order.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!order) {
      res.status(404).json({
        message: "Order not found.",
      });
      return;
    }

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    res.status(500).json({
      message: "Failed to get order.",
    });
  }
};



export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { status } = req.body;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  if (!status) {
    res.status(400).json({
      message: "Status is required.",
    });
    return;
  }

  try {
    const order = await Order.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!order) {
      res.status(404).json({
        message: "Order not found.",
      });
      return;
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);

    res.status(500).json({
      message: "Failed to update order.",
    });
  }
};




export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    res.status(401).json({
      message: "Unauthorized.",
    });
    return;
  }

  try {
    const order = await Order.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!order) {
      res.status(404).json({
        message: "Order not found.",
      });
      return;
    }

    await order.destroy();

    res.status(200).json({
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("Delete order error:", error);

    res.status(500).json({
      message: "Failed to delete order.",
    });
  }
};