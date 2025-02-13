class Shipment {
  constructor({ userId, packageId, addressId }) {
    this.userId = userId;
    this.packageId = packageId;
    this.addressId = addressId;
    this.status = 'PENDING'; // Initial status
  }
}

export default Shipment;