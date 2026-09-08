import { Request, Response } from "express";
import User from "../../models/User";
import Order from "../../models/orderModel";
import AppError from "../../utils/AppError";

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

  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.phone = phone;
  user.role = role;

  await user.save();

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

  if (Number(id) === adminId) {
    throw new AppError(
      "You cannot delete your own admin account.",
      400
    );
  }

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

  await user.destroy();

  res.status(200).json({
    message: "User deleted successfully.",
  });
};