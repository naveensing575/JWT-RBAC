import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    const response = await registerUser(username, email, password, role);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await loginUser(email, password, res);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    await refreshAccessToken(req, res);
  } catch (error) {
    res.status(403).json({ message: (error as Error).message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await logoutUser(req, res);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
