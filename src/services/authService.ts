import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import User, { IUser } from "../models/User";

const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" } // Expires in 1 hour
  );
};
const generateRefreshToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" } // Expires in 7 days
  );
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  role: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword, role });
  await newUser.save();

  return { message: "User registered successfully" };
};

export const loginUser = async (
  email: string,
  password: string,
  res: Response
) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token in database
  user.refreshToken = refreshToken;
  await user.save();

  // Set refresh token in HTTP-only cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return {
    accessToken,
    user: { id: user._id, username: user.username, role: user.role },
  };
};

export const refreshAccessToken = async (req: any, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken; // Get token from cookies
    if (!refreshToken) throw new Error("No refresh token provided");

    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("Invalid refresh token");

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err: any, decoded: any) => {
        if (err) throw new Error("Invalid refresh token");

        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    res.status(403).json({ message: (error as Error).message });
  }
};

export const logoutUser = async (req: any, res: Response) => {
  try {
    const user = await User.findOneAndUpdate(
      { refreshToken: req.cookies.refreshToken },
      { refreshToken: "" }
    );

    if (!user) return res.status(403).json({ message: "Invalid request" });

    // Clear refresh token from cookies
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
