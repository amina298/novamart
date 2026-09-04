import User from "./User";
import Product from "./productModel";
import Cart from "./cartModel";
import CartItem from "./cartItemModel";
import Order from "./orderModel";
import OrderItem from "./orderItemModel";
import Payment from "./paymentModel";
import Review from "./reviewModel";
import Wishlist from "./wishlistModel";

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


User.hasMany(Review, {
  foreignKey: "userId",
});

Review.belongsTo(User, {
  foreignKey: "userId",
});


Product.hasMany(Review, {
  foreignKey: "productId",
});

Review.belongsTo(Product, {
  foreignKey: "productId",
});


User.hasMany(Wishlist, {
  foreignKey: "userId",
});

Wishlist.belongsTo(User, {
  foreignKey: "userId",
});

Product.hasMany(Wishlist, {
  foreignKey: "productId",
});

Wishlist.belongsTo(Product, {
  foreignKey: "productId",
});

export {};