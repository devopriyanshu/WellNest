import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";

// Sign a JWT token
export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET); // Verifies the token using the secret key
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
