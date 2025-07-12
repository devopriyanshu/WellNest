import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";
import { findUsersById } from "../models/userModel.js";
import { findExpertById } from "../models/expertModel.js";
import { findCenterById } from "../models/centreModel.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // ✅ Securely verify

    const { id, role } = decoded;
    // let refId = null;
    console.log("decoded", decoded);

    // if (role === "user") {
    //   const user = await findUsersById(id); // central_users.id
    //   if (!user) return res.status(404).send("User not found");

    //   refId = user.id;
    // } else if (role === "expert") {
    //   const expert = await findExpertById(id);
    //   if (!expert) return res.status(404).send("Expert not found");
    //   refId = expert.id;
    // } else if (role === "center") {
    //   const center = await findCenterById(id);
    //   if (!center) return res.status(404).send("Center not found");
    //   refId = center.id;
    // }
    // console.log(refId);

    req.user = {
      userId: id,
      role,
      // refId,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(400).send("Invalid or expired token");
  }
};
