import IShipmentRepository from './IShipmentRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';
import Shipment from '../entities/Shipment.js';

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

  async findById(shipmentId) {
    const result = await this.db.query('SELECT * FROM shipments WHERE id = ?', [shipmentId]);
    if (result.length === 0) return null;
    const { id, user_id, package_id, route_id, carrier_id, destination_address, status, created_at, updated_at } = result[0];
    return new Shipment({
      id,
      userId: user_id,
      packageId: package_id,
      routeId: route_id,
      carrierId: carrier_id,
      addressId: destination_address,
      status,
      createdAt: created_at,
      updatedAt: updated_at
    });
  }

  async update(shipment) {
    const result = await this.db.query(
      'UPDATE shipments SET route_id = ?, carrier_id = ?, status = ? WHERE id = ?',
      [shipment.routeId, shipment.carrierId, shipment.status, shipment.id]
    );
    return result.affectedRows > 0;
  }
}

export default new ShipmentRepository();