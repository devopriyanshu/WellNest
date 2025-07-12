import { createUser, findUserByEmail } from "../models/centralUserModel.js";
import { generateToken } from "../utils/jwtUtility.js";
import { comparepassword, hashpassword } from "../utils/passwordUtil.js";

export const signup = async (email, password, role = "user") => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const name = email.split("@")[0];
  const hashedPassword = await hashpassword(password);
  console.log("[🔐 Hashed Password]", hashedPassword);

  const newUser = await createUser(name, email, hashedPassword, role, "local");
  console.log("[👤 New User Created]", newUser);

  const token = generateToken(newUser.id, role); // pass role to token if needed
  return { user: newUser, token };
};

export const login = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isValid = await comparepassword(password, user.password);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }
  const token = generateToken(user.id, user.role);
  return { user, token };
};

// export const googleSignInService = async (idToken) => {
//   try {
//     const ticket = await client.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     console.log("payload", payload);

//     const { email, name } = payload;

//     let user = await findUserByEmail(email);

//     if (!user) {
//       user = await createUser(name, email, null);
//     }

//     const token = generateToken(user.id, user.role || "user");

//     return { user, token };
//   } catch (error) {
//     console.error("Google Token Verification Failed:", error);
//     throw new Error("Invalid or expired Google token");
//   }
// };
