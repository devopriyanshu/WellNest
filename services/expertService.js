import { error } from "console";
import {
  findExpertByEmail,
  findExpertById,
  getExpertById,
  registerExpertModel,
  updateExpertModel,
} from "../models/expertModel.js";

export const registerExpertService = async (data) => {
  const existing = await findExpertByEmail(data.contact.email);
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

  const updated = await updateExpertModel(expertId, updateData);
  return updated;
};

export const getExpertService = async (id) => {
  const expert = await getExpertById(id);

  return expert;
};
