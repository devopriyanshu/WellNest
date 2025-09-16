import { listCenterModel } from "../models/centreModel.js";
import {
  getCenterDetailByIdService,
  registerCenterService,
  updateCenterService,
} from "../services/centreService.js";

export const registerCenterController = async (req, res) => {
  try {
    const { body, files } = req;

    let parsedData;

    // Check if data is sent as centerData (single JSON string) or individual fields
    if (body.centerData) {
      // Handle centerData format
      try {
        parsedData = JSON.parse(body.centerData);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format in centerData",
        });
      }
    } else {
      // Handle individual fields format
      const safeJsonParse = (value, fieldName) => {
        if (typeof value === "string") {
          try {
            return JSON.parse(value);
          } catch (err) {
            throw new Error(
              `Invalid JSON format for ${fieldName}: ${err.message}`
            );
          }
        }
        return value;
      };

      parsedData = {
        ...body,
        amenities: safeJsonParse(body.amenities, "amenities"),
        equipment: safeJsonParse(body.equipment, "equipment"),
        services: safeJsonParse(body.services, "services"),
        trainers: safeJsonParse(body.trainers, "trainers"),
        pricingData: safeJsonParse(body.pricingData, "pricingData"),
        schedule: safeJsonParse(body.schedule, "schedule"),
      };
    }

    console.log("Parsed data:", parsedData);

    const centerImageUrl = files.centerImage ? files.centerImage[0].path : null;
    const galleryUrls = files.images ? files.images.map((img) => img.path) : [];

    const newCenter = await registerCenterService(
      parsedData,
      galleryUrls,
      centerImageUrl
    );

    res.status(201).json({
      success: true,
      data: newCenter,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ success: false, message: err.message });
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
    res.status(200).json({
      success: true,
      data: centers,
      message: "Experts fetched successfully",
    });
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
