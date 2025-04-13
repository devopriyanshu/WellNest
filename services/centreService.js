import {
  findCenterByEmail,
  registerCenterModel,
} from "../models/centreModel.js";

export const registerCenterService = async (data) => {
  const existing = await findCenterByEmail(data.email);
  if (existing) {
    throw new Error("center with this email already exists");
  }
  const center = await registerCenterModel(data);
  return center;
};
