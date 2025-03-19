import { createUser, findUserByEmail } from "../models/userModel.js";
import { generateToken } from "../utils/jwtUtility.js";
import { comparepassword, hashpassword } from "../utils/passwordUtil.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (email, password) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("user already exists");
  }
  const name = email.split("@")[0];
  const hashedPassword = await hashpassword(password);
  console.log(hashedPassword);

  const newUser = await createUser(name, email, hashedPassword);
  console.log(newUser);

  const token = generateToken(newUser.id);
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
  const token = generateToken(user.id);
  return { user, token };
};

export const googleSignInService = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("payload", payload);

    const { email, name } = payload;

    let user = await findUserByEmail(email);

    if (!user) {
      const name = email.split("@")[0];
      user = await createUser(name, email, null);
    }

    const token = generateToken(user.id);

    return { user, token };
  } catch (error) {
    console.error("Google Token Verification Failed:", error);
    throw new Error("Invalid or expired Google token");
  }
};
