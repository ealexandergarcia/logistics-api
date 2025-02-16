import ShipmentStatusRepository from '../../domain/repositories/shipmentStatusRepository.js';

/**
 * Retrieves the status of a specific shipment by its ID.
 * 
 * This use case fetches the status of a shipment from the `ShipmentStatusRepository`.
 * If the shipment is not found or the data is empty, it throws an error.
 * 
 * @param {string} shipmentId - The ID of the shipment to retrieve the status for.
 * @returns {Object} - The status data of the shipment.
 * @throws {Error} - If the shipment is not found or the data is empty.
 */
export const getShipmentStatusUseCase = async (shipmentId) => {
  const shipmentData = await ShipmentStatusRepository.getStatus(shipmentId);
  if (!shipmentData || Object.keys(shipmentData).length === 0) {
    throw new Error('Shipment not found');
  }
  return shipmentData;
};