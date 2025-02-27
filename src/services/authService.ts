import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// User Registration Service
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  role: string
) => {
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already in use");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create and save new user
  const newUser = new User({ username, email, password: hashedPassword, role });
  await newUser.save();

  return { message: "User registered successfully" };
};

// User Login Service
export const loginUser = async (email: string, password: string) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  // Generate JWT Token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: { id: user._id, username: user.username, role: user.role },
  };
};
