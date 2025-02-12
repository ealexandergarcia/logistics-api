import redisClient from '../../config/redisClient.js';
import ShipmentRepository from './shipmentRepository.js';

/**
 * Repository for managing shipment status data.
 * 
 * This class provides methods for retrieving and updating shipment status data,
 * with support for caching in Redis.
 * 
 * @class
 */
class ShipmentStatusRepository {
  /**
   * Retrieves the status of a shipment by its ID.
   * 
   * @param {string} shipmentId - The ID of the shipment to retrieve the status for.
   * @returns {Object} - The shipment status data.
   * @throws {Error} - If an error occurs while retrieving the status.
   */
  async getStatus(shipmentId) {
    try {
      let shipmentData = await redisClient.hGetAll(`shipment:${shipmentId}`);

      if (!shipmentData || Object.keys(shipmentData).length === 0) {
        shipmentData = await ShipmentRepository.findById(shipmentId);
        if (shipmentData) {
          await this.setShipmentData(shipmentId, shipmentData);
        }
      }

      return shipmentData;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the status of a shipment in Redis.
   * 
   * @param {string} shipmentId - The ID of the shipment to update.
   * @param {string} status - The new status of the shipment.
   * @throws {Error} - If an error occurs while updating the status.
   */
  async setStatus(shipmentId, status) {
    try {
      await redisClient.hSet(`shipment:${shipmentId}`, 'status', status);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sets shipment data in Redis.
   * 
   * @param {string} shipmentId - The ID of the shipment.
   * @param {Object} shipmentData - The shipment data to store in Redis.
   * @throws {Error} - If an error occurs while setting the data.
   */
  async setShipmentData(shipmentId, shipmentData) {
    try {
      // Convert dates to ISO strings and create a flat object for Redis
      const redisData = {};
      for (const [key, value] of Object.entries(shipmentData)) {
        if (value instanceof Date) {
          redisData[key] = value.toISOString();
        } else if (value !== null && value !== undefined) {
          redisData[key] = String(value); // Convert all values to strings for Redis
        }
      }

      // Use multiple hSet operations if needed
      await redisClient.hSet(`shipment:${shipmentId}`, redisData);
    } catch (error) {
      console.error(`Error setting shipment data for ID ${shipmentId}:`, error);
      throw error;
    }
  }
}

export default new ShipmentStatusRepository();