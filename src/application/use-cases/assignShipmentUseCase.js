import ShipmentRepository from '../../domain/repositories/shipmentRepository.js';
import CarrierRepository from '../../domain/repositories/carrierRepository.js';
import RouteRepository from '../../domain/repositories/routeRepository.js';

export const assignShipmentUseCase = async ({ userId, shipmentId, routeId, carrierId }) => {
  const carrier = await CarrierRepository.findById(carrierId);
  if (!carrier || !carrier.isAvailable()) {
    throw new Error('Carrier is not available');
  }

  const route = await RouteRepository.findById(routeId);
  if (!route) {
    throw new Error('Route not found');
  }

  const shipment = await ShipmentRepository.findById(shipmentId);
  if (!shipment) {
    throw new Error('Shipment not found');
  }

  if (carrier.capacity < shipment.weight) {
    throw new Error('Vehicle capacity exceeded');
  }

  shipment.routeId = routeId;
  shipment.carrierId = carrierId;
  shipment.status = 'IN_TRANSIT';
  await ShipmentRepository.update(shipment);

  return shipment;
};