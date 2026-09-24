import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      message: "Unauthorized.",
    });

    return;
  }

  const parts = authHeader.trim().split(/\s+/);

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({
      message: "Invalid authorization header.",
    });

    return;
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      }
    ) as Express.UserPayload;

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token.",
    });

    return;
  }
};