import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Access denied." });
      return;
    }
    next();
  };
};
