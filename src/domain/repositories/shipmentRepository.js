import IShipmentRepository from './IShipmentRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';

class ShipmentRepository extends IShipmentRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  async save(shipment) {
    const result = await this.db.query(
      'INSERT INTO shipments (user_id, package_id, address_id, return_address_id, status) VALUES (?, ?, ?, ?, ?)',
      [shipment.userId, shipment.packageId, shipment.addressId, shipment.returnAddressId, shipment.status]
    );
    return result.insertId;
  }
}

export default new ShipmentRepository();