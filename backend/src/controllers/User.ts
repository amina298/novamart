import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User";
import Cart from "../models/cartModel";
import { sequelize } from "../config/sequelize";
import AppError from "../utils/AppError";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Read validated request data
  const { firstName, lastName, email, password, phone } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email already exists.", 409);
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  /*
   * Create the user and cart inside one transaction.
   *
   * If either operation fails, both operations
   * are rolled back.
   */
  const user = await sequelize.transaction(async (transaction) => {
    // Create the user
    const newUser = await User.create(
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
      },
      { transaction }
    );

    // Create an empty cart for the new user
    await Cart.create(
      {
        userId: newUser.id,
      },
      { transaction }
    );

    return newUser;
  });

  // Send success response
  res.status(201).json({
    message: "User registered successfully.",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
};

export const getProfile = (
  req: Request,
  res: Response
): void => {
  res.status(200).json({
    user: req.user,
  });
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { firstName, lastName, phone } = req.body;

  const user = await User.findByPk(req.user!.id);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.phone = phone;

  await user.save();

  res.status(200).json({
    message: "Profile updated successfully.",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
};

export const deleteProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;

  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  await user.destroy();

  res.status(200).json({
    message: "Profile deleted successfully.",
  });
};