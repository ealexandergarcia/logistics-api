import redisClient from '../../config/redisClient.js';
import ShipmentRepository from './shipmentRepository.js';

class ShipmentStatusRepository {
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

  async setStatus(shipmentId, status) {
    try {
      await redisClient.hSet(`shipment:${shipmentId}`, 'status', status);
    } catch (error) {
      throw error;
    }
  }

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
      await redisClient.hSet(
        `shipment:${shipmentId}`,
        redisData
      );
    } catch (error) {
      console.error(`Error setting shipment data for ID ${shipmentId}:`, error);
      throw error;
    }
  }
}

export default new ShipmentStatusRepository();