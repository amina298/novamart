import User from "./User";
import Product from "./productModel";
import Cart from "./cartModel";
import CartItem from "./cartItemModel";
import Order from "./orderModel";
import OrderItem from "./orderItemModel";
import Payment from "./paymentModel";

User.hasOne(Cart, {
  foreignKey: "userId",
});

Cart.belongsTo(User, {
  foreignKey: "userId",
});

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
});

CartItem.belongsTo(Cart, {
  foreignKey: "cartId",
});

Product.hasMany(CartItem, {
  foreignKey: "productId",
});

CartItem.belongsTo(Product, {
  foreignKey: "productId",
});

// User → Order
User.hasMany(Order, {
  foreignKey: "userId",
});

Order.belongsTo(User, {
  foreignKey: "userId",
});

// Order → OrderItem
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
});

// Product → OrderItem
Product.hasMany(OrderItem, {
  foreignKey: "productId",
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
});

// Order → Payment

Order.hasOne(Payment, {
  foreignKey: "orderId",
});

Payment.belongsTo(Order, {
  foreignKey: "orderId",
});

export {};