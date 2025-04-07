import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { JWT_SECRET } from "../config/auth.js";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer", "");

  if (!token) {
    return res.status(401).send("Access denied");
  }
  try {
    const decoded = jwtDecode(token);
    console.log(decoded);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).send("Invalid token");
  }
};
