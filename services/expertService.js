import { error } from "console";
import {
  findExpertByEmail,
  registerExpertModel,
} from "../models/expertModel.js";

export const registerExpertService = async (data) => {
  const existing = await findExpertByEmail(data.email);
  if (existing) {
    throw new Error("Expert with this email already exists");
  }
  const expert = await registerExpertModel(data);
  return expert;
};
