/**
 * Represents a shipment to be transported.
 * 
 * This class defines the structure of a shipment, including its ID, user ID, package ID,
 * route ID, carrier ID, address ID, return address ID, status, and timestamps.
 * 
 * @class
 */
class Shipment {
  /**
   * Creates an instance of Shipment.
   * 
   * @param {Object} params - The shipment details.
   * @param {string} params.id - The unique identifier of the shipment.
   * @param {string} params.userId - The ID of the user who created the shipment.
   * @param {string} params.packageId - The ID of the package being shipped.
   * @param {string} params.routeId - The ID of the route for the shipment.
   * @param {string} params.carrierId - The ID of the carrier assigned to the shipment.
   * @param {string} params.addressId - The ID of the destination address.
   * @param {string} params.returnAddressId - The ID of the return address.
   * @param {string} [params.status='PENDING'] - The current status of the shipment.
   * @param {Date} params.createdAt - The timestamp when the shipment was created.
   * @param {Date} params.updatedAt - The timestamp when the shipment was last updated.
   */
  constructor({ id, userId, packageId, routeId, carrierId, addressId, returnAddressId, status = 'PENDING', createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;
    this.packageId = packageId;
    this.routeId = routeId;
    this.carrierId = carrierId;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.addressId = addressId;
    this.returnAddressId = returnAddressId;
  }
}

export default Shipment;