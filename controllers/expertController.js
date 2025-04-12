import {
  registerExpertService,
  updateExpertService,
} from "../services/expertService.js";
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
