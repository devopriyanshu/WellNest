import {
  findCenterByEmail,
  registerCenterModel,
  getCenterDetailByIdModel,
  updateCenterByIdModel,
} from "../models/centreModel.js";

export const registerCenterService = async (
  data,
  imageUrls = [],
  centerImageUrl = null
) => {
  const existing = await findCenterByEmail(data.email);
  if (existing) {
    throw new Error("Center with this email already exists");
  }
  return await registerCenterModel(data, imageUrls, centerImageUrl);
};

export const getCenterDetailByIdService = async (id) => {
  return await getCenterDetailByIdModel(id);
};

export const updateCenterService = async (id, updateData) => {
  return await updateCenterByIdModel(id, updateData);
};
