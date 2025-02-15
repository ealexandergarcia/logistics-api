import ShipmentReportRepository from "../../domain/repositories/shipmentReportRepository.js";

export const getAdvancedShipmentReportUseCase = async (filters) => {
  return await ShipmentReportRepository.getAdvancedReport(filters);
};