import IShipmentRepository from './IShipmentRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';
import Shipment from '../entities/Shipment.js';

/**
 * Repository for managing shipment data.
 * 
 * This class implements the `IShipmentRepository` interface and provides methods
 * for saving, retrieving, and updating shipment data in the database.
 * 
 * @class
 * @extends IShipmentRepository
 */
class ShipmentRepository extends IShipmentRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  /**
   * Saves a new shipment to the database.
   * 
   * @param {Shipment} shipment - The shipment object to save.
   * @returns {number} - The ID of the newly created shipment.
   */
  async save(shipment) {
    const result = await this.db.query(
      'INSERT INTO shipments (user_id, package_id, address_id, return_address_id, status) VALUES (?, ?, ?, ?, ?)',
      [shipment.userId, shipment.packageId, shipment.addressId, shipment.returnAddressId, shipment.status]
    );
    return result.insertId;
  }

  /**
   * Finds a shipment by its ID.
   * 
   * @param {string} shipmentId - The ID of the shipment to find.
   * @returns {Shipment|null} - The shipment object if found, otherwise null.
   */
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

  /**
   * Updates an existing shipment in the database.
   * 
   * @param {Shipment} shipment - The shipment object to update.
   * @returns {boolean} - True if the update was successful, otherwise false.
   */
  async update(shipment) {
    const result = await this.db.query(
      'UPDATE shipments SET route_id = ?, carrier_id = ?, status = ? WHERE id = ?',
      [shipment.routeId, shipment.carrierId, shipment.status, shipment.id]
    );
    return result.affectedRows > 0;
  }
}

export default new ShipmentRepository();