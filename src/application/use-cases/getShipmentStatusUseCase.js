import ShipmentStatusRepository from '../../domain/repositories/shipmentStatusRepository.js';

export const getShipmentStatusUseCase = async (shipmentId) => {
  const shipmentData = await ShipmentStatusRepository.getStatus(shipmentId);
  if (!shipmentData || Object.keys(shipmentData).length === 0) {
    throw new Error('Shipment not found');
  }
  return shipmentData;
};