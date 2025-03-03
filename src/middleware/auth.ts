import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
      tokenVersion: number;
    };

    // Fetch user from DB and check tokenVersion
    const user = await User.findById(decoded.id);
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      res
        .status(401)
        .json({ message: "Token is invalid. Please log in again." });
      return;
    }

    req.user = { id: user.id.toString(), role: user.role };
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
