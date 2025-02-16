import { getAdvancedShipmentReportUseCase } from "../../../application/use-cases/getAdvancedShipmentReportUseCase.js";
import redisClient from '../../../config/redisClient.js';

/**
 * Retrieves an advanced shipment report based on filters.
 * 
 * This controller handles the retrieval of an advanced shipment report using the provided filters.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const getAdvancedShipmentReport = async (req, res) => {
  try {
    const filters = req.query;
    const cacheKey = `shipmentReport:${JSON.stringify(filters)}`;

    // Check Redis cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // If no cache, fetch from the database
    const report = await getAdvancedShipmentReportUseCase(filters);
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};