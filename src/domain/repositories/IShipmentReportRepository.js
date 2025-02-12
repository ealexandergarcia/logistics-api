/**
 * Interface for the Shipment Report Repository.
 * 
 * This class defines the contract for the Shipment Report Repository, which must be implemented
 * by any concrete repository class.
 * 
 * @class
 */
export default class IShipmentReportRepository {
  /**
   * Retrieves an advanced shipment report based on the provided filters.
   * 
   * @param {Object} filters - The filters to apply when fetching the report.
   * @throws {Error} - If the method is not implemented.
   */
  async getAdvancedReport(filters) {
    throw new Error('Method not implemented');
  }
}