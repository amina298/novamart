import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("Middleware reached");
  console.log(req.headers.authorization);
  // Read the Authorization header

  const authHeader = req.headers.authorization;
  console.log(authHeader);
  // Check if the header exists
  if (!authHeader) {
    res.status(401).json({
      message: "Unauthorized.",
    });

    return;
  }

  // Extract the JWT
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
  const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET as string
) as Express.UserPayload;

req.user = decoded;



    // Token is valid, continue to the controller
    next();
  } catch (error) {
    // Token is invalid or expired
    res.status(401).json({
      message: "Invalid or expired token.",
    });

    return;
  }
};