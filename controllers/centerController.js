import { listCenterModel } from "../models/centreModel.js";
import {
  getCenterDetailByIdService,
  registerCenterService,
  updateCenterService,
} from "../services/centreService.js";

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
  const filters = {
    category: req.query.category,
    city: req.query.city,
    search: req.query.search,
  };

  try {
    const centers = await listCenterModel(filters, page, limit);
    res.status(200).json({ centers, page });
  } catch (err) {
    console.error("Error fetching centers:", err);
    res.status(500).json({ error: "Failed to fetch centers" });
  }
};
export const getCenterByIdController = async (req, res) => {
  try {
    const center = await getCenterDetailByIdService(req.params.id);
    if (!center) {
      return res.status(404).json({ error: "Center not found" });
    }
    res.status(200).json(center);
  } catch (err) {
    console.error("Get Center Error:", err);
    res.status(500).json({ error: "Failed to fetch center" });
  }
};

// Update center info
export const updateCenterByIdController = async (req, res) => {
  try {
    const updated = await updateCenterService(req.params.id, req.body);
    res
      .status(200)
      .json({ message: "Center updated successfully", data: updated });
  } catch (err) {
    console.error("Update Center Error:", err);
    res.status(500).json({ error: "Failed to update center" });
  }
};
