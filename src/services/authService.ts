import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import validator from "validator";
import User, { IUser } from "../models/User";

/**
 * Generate an Access Token
 */
const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    {
      id: user.id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
};

/**
 * Generate a Refresh Token
 */
const generateRefreshToken = (user: IUser) => {
  return jwt.sign(
    { id: user.id.toString(), tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
};

/**
 * Register a new user
 */
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  role: string
) => {
  if (!validator.isEmail(email) || !validator.isLength(password, { min: 8 })) {
    throw new Error("Invalid email format or password too short");
  }

  const sanitizedUsername = validator.escape(username.trim());
  const sanitizedEmail = validator.normalizeEmail(email) as string;

  const existingUser = await User.findOne({ email: sanitizedEmail });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username: sanitizedUsername,
    email: sanitizedEmail,
    password: hashedPassword,
    role,
    tokenVersion: 0,
  });

  await newUser.save();
  return { message: "User registered successfully" };
};

/**
 * Login user and generate tokens
 */
export const loginUser = async (
  email: string,
  password: string,
  res: Response
) => {
  if (!validator.isEmail(email) || !validator.isLength(password, { min: 8 })) {
    throw new Error("Invalid credentials");
  }

  const sanitizedEmail = validator.normalizeEmail(email) as string;
  const user = await User.findOne({ email: sanitizedEmail });
  if (!user) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    accessToken,
    user: { id: user.id.toString(), username: user.username, role: user.role },
  };
};

/**
 * Refresh Access Token
 */
export const refreshAccessToken = async (req: any, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error("No refresh token provided");

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string; tokenVersion: number };

    const user = await User.findById(decoded.id);
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: (error as Error).message });
  }
};

/**
 * Logout User
 */
export const logoutUser = async (req: any, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "No token provided" });

    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: "Invalid request" });

    user.refreshToken = "";
    user.tokenVersion += 1;
    await user.save();

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
