import { Request, Response } from "express";
import User from "../../models/User";
import Order from "../../models/orderModel";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    res.status(500).json({
      message: "Failed to get all users.",
    });
  }
};


export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  try {
    const user = await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });

      return;
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);

    res.status(500).json({
      message: "Failed to get user.",
    });
  }
};


export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;

  const {
    firstName,
    lastName,
    email,
    phone,
    role,
  } = req.body;

  // 1. Validate required fields
  if (!firstName || !lastName || !email || !phone || !role) {
    res.status(400).json({
      message: "All fields are required.",
    });

    return;
  }

  // 2. Validate role
  const allowedRoles = ["customer", "admin"];

  if (!allowedRoles.includes(role)) {
    res.status(400).json({
      message: "Invalid user role.",
    });

    return;
  }

  try {
    // 3. Find the user
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });

      return;
    }

    // 4. Update user
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.role = role;

    await user.save();

    // 5. Return user without password
    const updatedUser = await User.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });

    res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    res.status(500).json({
      message: "Failed to update user.",
    });
  }
};


export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.id as string;
  const adminId = req.user?.id;

  if (!adminId) {
    res.status(401).json({
      message: "Unauthorized.",
    });

    return;
  }

  try {
    // 1. Find the user
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        message: "User not found.",
      });

      return;
    }

    // 2. Prevent admin from deleting their own account
    if (Number(id) === adminId) {
      res.status(400).json({
        message: "You cannot delete your own admin account.",
      });

      return;
    }

    // 3. Check whether the user has existing orders
    const order = await Order.findOne({
      where: {
        userId: id,
      },
    });

    if (order) {
      res.status(400).json({
        message: "Cannot delete a user who has existing orders.",
      });

      return;
    }

    // 4. Delete the user
    await user.destroy();

    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      message: "Failed to delete user.",
    });
  }
};