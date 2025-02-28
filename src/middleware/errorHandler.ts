import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`);

  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
};

export default errorHandler;
