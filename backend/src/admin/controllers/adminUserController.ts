import { Request, Response } from "express";
import User from "../../models/User";
import Order from "../../models/orderModel";
import AppError from "../../utils/AppError";

/**
 * Get all users
 * Admin only
 */
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const users = await User.findAll({
    attributes: {
      exclude: ["password"],
    },
  });

  res.status(200).json({
    users,
  });
};

/**
 * Get one user by ID
 * Admin only
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  const user = await User.findByPk(id, {
    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  res.status(200).json({
    user,
  });
};

/**
 * Update user
 * Admin only
 *
 * Admin can:
 * - Update first name
 * - Update last name
 * - Update email
 * - Update phone
 * - Change customer -> admin
 * - Change admin -> customer
 *
 * Admin cannot:
 * - Demote themselves
 * - Leave the system with zero admins
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;
  const adminId = req.user?.id;

  if (!adminId) {
    throw new AppError("Unauthorized.", 401);
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    role,
  } = req.body;

  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  /*
   * Prevent an admin from changing their own role.
   *
   * This means an admin cannot demote themselves
   * from admin -> customer.
   */
  if (Number(id) === adminId && role !== "admin") {
    throw new AppError(
      "You cannot demote yourself from admin.",
      400
    );
  }

  /*
   * Check whether the email is already being used
   * by another user.
   */
  const existingUser = await User.findOne({
    where: {
      email,
    },
  });

  if (existingUser && existingUser.id !== user.id) {
    throw new AppError(
      "Email is already being used by another user.",
      400
    );
  }

  /*
   * If an admin is being demoted, make sure there
   * will still be at least one admin in the system.
   */
  if (user.role === "admin" && role === "customer") {
    const adminCount = await User.count({
      where: {
        role: "admin",
      },
    });

    if (adminCount <= 1) {
      throw new AppError(
        "You cannot demote the last admin.",
        400
      );
    }
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.phone = phone;
  user.role = role;

  await user.save();

  /*
   * Fetch the updated user without exposing
   * the password.
   */
  const updatedUser = await User.findByPk(id, {
    attributes: {
      exclude: ["password"],
    },
  });

  res.status(200).json({
    message: "User updated successfully.",
    user: updatedUser,
  });
};

/**
 * Delete user
 * Admin only
 *
 * Admin cannot:
 * - Delete themselves
 * - Delete a user who has existing orders
 * - Leave the system with zero admins
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;
  const adminId = req.user?.id;

  if (!adminId) {
    throw new AppError("Unauthorized.", 401);
  }

  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  /*
   * Prevent an admin from deleting their own account.
   */
  if (Number(id) === adminId) {
    throw new AppError(
      "You cannot delete your own admin account.",
      400
    );
  }

  /*
   * Prevent deleting a user who has existing orders.
   *
   * Orders are historical business records and should
   * not be removed by deleting the customer.
   */
  const order = await Order.findOne({
    where: {
      userId: id,
    },
  });

  if (order) {
    throw new AppError(
      "Cannot delete a user who has existing orders.",
      400
    );
  }

  /*
   * If the user being deleted is an admin,
   * make sure another admin will remain.
   */
  if (user.role === "admin") {
    const adminCount = await User.count({
      where: {
        role: "admin",
      },
    });

    if (adminCount <= 1) {
      throw new AppError(
        "You cannot delete the last admin.",
        400
      );
    }
  }

  await user.destroy();

  res.status(200).json({
    message: "User deleted successfully.",
  });
};