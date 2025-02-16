import ICarrierRepository from './ICarrierRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';
import Carrier from '../entities/Carrier.js';

/**
 * Repository for managing carrier data.
 * 
 * This class implements the `ICarrierRepository` interface and provides methods
 * for retrieving carrier data from the database.
 * 
 * @class
 * @extends ICarrierRepository
 */
class CarrierRepository extends ICarrierRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  /**
   * Finds a carrier by its ID.
   * 
   * @param {string} carrierId - The ID of the carrier to find.
   * @returns {Carrier|null} - The carrier object if found, otherwise null.
   */
  async findById(carrierId) {
    const result = await this.db.query('SELECT * FROM carriers WHERE id = ?', [carrierId]);
    if (result.length === 0) return null;
    const { id, name, vehicle_type, capacity, status } = result[0];
    return new Carrier(id, name, vehicle_type, capacity, status);
  }
}

export default new CarrierRepository();