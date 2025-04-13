import { listCenterModel } from "../models/centreModel.js";
import { registerCenterService } from "../services/centreService.js";

export const registerCenterController = async (req, res) => {
  try {
    const result = await registerCenterService(req.body);
    res.status(201).json({
      message: "Center registered successfully",
      centerId: result.centerId,
    });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ error: "Failed to register center" });
  }
};

export const listCenterController = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const centers = await listCenterModel(page, limit);
    res.status(200).json({ centers, page });
  } catch (err) {
    console.error("Error fetching centers:", err);
    res.status(500).json({ error: "Failed to fetch centers" });
  }
};
