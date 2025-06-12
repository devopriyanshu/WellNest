import {
  findCenterByEmail,
  registerCenterModel,
  getCenterDetailByIdModel,
  updateCenterByIdModel,
} from "../models/centreModel.js";

export const registerCenterService = async (data) => {
  const existing = await findCenterByEmail(data.email);
  if (existing) {
    throw new Error("center with this email already exists");
  }
  return await registerCenterModel(data);
};

export const getCenterDetailByIdService = async (id) => {
  return await getCenterDetailByIdModel(id);
};

export const updateCenterService = async (id, updateData) => {
  return await updateCenterByIdModel(id, updateData);
};
