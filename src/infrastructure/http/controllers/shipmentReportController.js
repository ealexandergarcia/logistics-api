import { getAdvancedShipmentReportUseCase } from "../../../application/use-cases/getAdvancedShipmentReportUseCase.js";

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
    const report = await getAdvancedShipmentReportUseCase(filters);
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};