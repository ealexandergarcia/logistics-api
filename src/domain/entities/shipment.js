class Shipment {
  constructor({ userId, packageId, addressId, returnAddressId }) {
    this.userId = userId;
    this.packageId = packageId;
    this.addressId = addressId;
    this.returnAddressId = returnAddressId;
    this.status = 'PENDING'; // Initial status
  }
}

export default Shipment;