import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import AppError from "../utils/AppError";

export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  console.log("Email:", email);
console.log("Password:", password);

  const user = await User.findOne({
    where: {
      email,
    },
  });
  console.log("User found:", user?.id);

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

 const isPasswordValid = await bcrypt.compare(
  password,
  user.password
);

console.log("Password valid:", isPasswordValid);

if (!isPasswordValid) {
  throw new AppError("Invalid email or password.", 401);
}

  console.log("Creating JWT...");
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
  console.log("JWT created successfully");

  res.status(200).json({
    message: "Login successful.",
    token,
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