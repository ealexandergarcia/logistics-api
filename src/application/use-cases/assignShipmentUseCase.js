import ShipmentRepository from '../../domain/repositories/shipmentRepository.js';
import CarrierRepository from '../../domain/repositories/carrierRepository.js';
import RouteRepository from '../../domain/repositories/routeRepository.js';

/**
 * Assigns a shipment to a specific carrier and route.
 * 
 * This use case handles the logic for assigning a shipment to a carrier and route.
 * It performs the following steps:
 * 1. Validates the carrier's availability.
 * 2. Validates the existence of the route.
 * 3. Validates the existence of the shipment.
 * 4. Checks if the carrier's capacity can handle the shipment's weight.
 * 5. Updates the shipment's status to "IN_TRANSIT" and assigns it to the carrier and route.
 * 
 * @param {Object} params - The parameters for the assignment.
 * @param {string} params.userId - The ID of the user performing the assignment.
 * @param {string} params.shipmentId - The ID of the shipment to be assigned.
 * @param {string} params.routeId - The ID of the route to assign the shipment to.
 * @param {string} params.carrierId - The ID of the carrier to assign the shipment to.
 * @returns {Object} - The updated shipment object.
 * @throws {Error} - If the carrier is not available, the route or shipment is not found, or the carrier's capacity is exceeded.
 */
export const assignShipmentUseCase = async ({ userId, shipmentId, routeId, carrierId }) => {
  // Step 1: Validate carrier availability
  const carrier = await CarrierRepository.findById(carrierId);
  if (!carrier || !carrier.isAvailable()) {
    throw new Error('Carrier is not available');
  }

  // Step 2: Validate route existence
  const route = await RouteRepository.findById(routeId);
  if (!route) {
    throw new Error('Route not found');
  }

  // Step 3: Validate shipment existence
  const shipment = await ShipmentRepository.findById(shipmentId);
  if (!shipment) {
    throw new Error('Shipment not found');
  }

  // Step 4: Check carrier capacity
  if (carrier.capacity < shipment.weight) {
    throw new Error('Vehicle capacity exceeded');
  }

  // Step 5: Update shipment details
  shipment.routeId = routeId;
  shipment.carrierId = carrierId;
  shipment.status = 'IN_TRANSIT';
  await ShipmentRepository.update(shipment);

  // Return the updated shipment
  return shipment;
};