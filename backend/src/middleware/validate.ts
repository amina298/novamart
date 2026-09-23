import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import AppError from "../utils/AppError";

const validate = (
  schema: ZodSchema,
  source: "body" | "params" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = source === "params" ? req.params : req.body;

    const result = schema.safeParse(data);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      throw new AppError(message, 400);
    }

    if (source === "params") {
      req.params = result.data as typeof req.params;
    } else {
      req.body = result.data;
    }

    next();
  };
};

export default validate;