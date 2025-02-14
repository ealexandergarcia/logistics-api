class Shipment {
  constructor({ id, userId, packageId, routeId, carrierId, addressId, returnAddressId, status, createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;
    this.packageId = packageId;
    this.routeId = routeId;
    this.carrierId = carrierId;
    this.status = 'PENDING'; // Initial status
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.addressId = addressId;
    this.returnAddressId = returnAddressId;
  }
}

export default Shipment;