import IShipmentReportRepository from './IShipmentReportRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';
import redisClient from '../../config/redisClient.js';

/**
 * Repository for managing shipment report data.
 * 
 * This class implements the `IShipmentReportRepository` interface and provides methods
 * for retrieving advanced shipment reports with caching support.
 * 
 * @class
 * @extends IShipmentReportRepository
 */
class ShipmentReportRepository extends IShipmentReportRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  /**
   * Retrieves an advanced shipment report based on the provided filters.
   * 
   * @param {Object} filters - The filters to apply when fetching the report.
   * @returns {Object} - The shipment report data.
   */
  async getAdvancedReport(filters) {
    const { startDate, endDate, status, carrierId, page = 1, limit = 10 } = filters;

    // Convert page and limit to numbers and avoid invalid values
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    const cacheKey = `shipmentReport:${JSON.stringify(filters)}`;

    // Check Redis cache before querying the database
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    let query = `
      SELECT s.id, s.status, s.created_at, s.updated_at, c.name AS carrier_name,
             TIMESTAMPDIFF(HOUR, s.created_at, s.updated_at) AS delivery_time_hours
      FROM shipments s
      LEFT JOIN carriers c ON s.carrier_id = c.id
      WHERE 1=1`;

    const params = [];

    if (startDate && endDate) {
      query += ' AND s.created_at BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    if (status) {
      query += ' AND s.status = ?';
      params.push(status);
    }

    if (carrierId) {
      query += ' AND s.carrier_id = ?';
      params.push(carrierId);
    }

    query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNumber, (pageNumber - 1) * limitNumber);

    const result = await this.db.query(query, params);

    // Cache the result for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));

    return result;
  }
}

export default new ShipmentReportRepository();