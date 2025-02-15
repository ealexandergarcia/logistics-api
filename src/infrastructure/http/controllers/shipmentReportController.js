import { getAdvancedShipmentReportUseCase } from "../../../application/use-cases/getAdvancedShipmentReportUseCase.js";

export const getAdvancedShipmentReport = async (req, res) => {
  try {
    const filters = req.query;
    const report = await getAdvancedShipmentReportUseCase(filters);
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};