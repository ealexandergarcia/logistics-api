import ShipmentReportRepository from "../../domain/repositories/shipmentReportRepository.js";

/**
 * Retrieves an advanced shipment report based on the provided filters.
 * 
 * This use case fetches a detailed shipment report by querying the `ShipmentReportRepository`
 * with the specified filters. It is typically used for generating reports with advanced filtering
 * options such as status, date range, carrier, etc.
 * 
 * @param {Object} filters - The filters to apply when fetching the report.
 * @returns {Object} - The advanced shipment report.
 */
export const getAdvancedShipmentReportUseCase = async (filters) => {
  return await ShipmentReportRepository.getAdvancedReport(filters);
};