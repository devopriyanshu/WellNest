import { registerExpertService } from "../services/expertService.js";
export const registerExpertController = async (req, res) => {
  try {
    const expert = await registerExpertService(req.body);
    res.status(201).json({ message: "Expert registered successfully", expert });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
