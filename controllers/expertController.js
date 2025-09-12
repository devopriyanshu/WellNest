import {
  getExpertService,
  registerExpertService,
  updateExpertService,
} from "../services/expertService.js";
import { listExpertModel } from "../models/expertModel.js";

export const registerExpertController = async (req, res) => {
  try {
    const { body, files } = req;

    const profilePicUrl = files.profilePic ? files.profilePic[0].path : null;
    const backgroundImageUrl = files.backgroundImage
      ? files.backgroundImage[0].path
      : null;
    const expert = await registerExpertService(
      body,
      profilePicUrl,
      backgroundImageUrl
    );
    res.status(201).json({
      message: "Expert registered successfully",
      expert,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

export const updateExpertController = async (req, res) => {
  try {
    const expertId = parseInt(req.params.id);
    const updateData = req.body;

    const updatedExpert = await updateExpertService(expertId, updateData);
    res.status(200).json({
      message: "Expert updated successfully",
      data: updatedExpert,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listExpertsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid page or limit parameter",
      });
    }

    const filters = {
      search: req.query.search || null,
      category: req.query.category || null,
      sortBy: req.query.sortBy || null,
    };

    const experts = await listExpertModel(filters, page, limit);

    res.status(200).json({
      success: true,
      data: experts,
      message: "Experts fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching experts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch experts",
      error: error.message,
    });
  }
};
export const getExpertController = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid expert ID" });
    }

    const expert = await getExpertService(id);
    res.json(expert);
  } catch (error) {
    console.error("Error fetching expert:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
