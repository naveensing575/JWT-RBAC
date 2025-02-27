import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";

// Register Controller
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    const response = await registerUser(username, email, password, role);
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// Login Controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await loginUser(email, password);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
