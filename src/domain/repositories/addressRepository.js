import IAddressRepository from './IAddressRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';

/**
 * Repository for managing address data.
 * 
 * This class implements the `IAddressRepository` interface and provides methods
 * for saving and retrieving address data from the database.
 * 
 * @class
 * @extends IAddressRepository
 */
class AddressRepository extends IAddressRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  /**
   * Saves a new address to the database.
   * 
   * @param {Address} address - The address object to save.
   * @returns {number} - The ID of the newly created address.
   */
  async save(address) {
    const result = await this.db.query(
      'INSERT INTO addresses (street_address, city, department, postal_code, country, details) VALUES (?, ?, ?, ?, ?, ?)',
      [address.streetAddress, address.city, address.department, address.postalCode, address.country, address.details]
    );
    return result.insertId;
  }
}

export default new AddressRepository();