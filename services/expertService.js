import { error } from "console";
import {
  findExpertByEmail,
  findExpertById,
  registerExpertModel,
  updateExpertInfo,
} from "../models/expertModel.js";

export const registerExpertService = async (data) => {
  const existing = await findExpertByEmail(data.email);
  if (existing) {
    throw new Error("Expert with this email already exists");
  }
  const expert = await registerExpertModel(data);
  return expert;
};
export const updateExpertService = async (expertId, updateData) => {
  const expert = await findExpertById(expertId);

  if (!expert) {
    throw new Error("expert not found");
  }

  const updated = await updateExpertInfo(expertId, updateData);
  return updated;
};
