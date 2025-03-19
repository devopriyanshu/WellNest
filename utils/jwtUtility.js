import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";

// Sign a JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET); // Verifies the token using the secret key
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
