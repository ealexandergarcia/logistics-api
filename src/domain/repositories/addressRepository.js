import IAddressRepository from './IAddressRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';

class AddressRepository extends IAddressRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  async save(address) {
    const result = await this.db.query(
      'INSERT INTO addresses (street_address, city, department, postal_code, country, details) VALUES (?, ?, ?, ?, ?, ?)',
      [address.streetAddress, address.city, address.department, address.postalCode, address.country, address.details]
    );
    return result.insertId;
  }
}

export default new AddressRepository();