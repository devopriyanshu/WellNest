import { registerCenterModel } from "../models/centreModel.js";

export const registerCenterController = async (req, res) => {
  try {
    const result = await registerCenterModel(req.body);
    res.status(201).json({
      message: "Center registered successfully",
      centerId: result.centerId,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ error: "Failed to register center" });
  }
};
