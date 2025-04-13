import {
  registerExpertService,
  updateExpertService,
} from "../services/expertService.js";
import { listExpertModel } from "../models/expertModel.js";

export const registerExpertController = async (req, res) => {
  try {
    const expert = await registerExpertService(req.body);
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const experts = await listExpertModel(page, limit);

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
