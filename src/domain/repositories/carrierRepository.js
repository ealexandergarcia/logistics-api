import ICarrierRepository from './ICarrierRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';
import Carrier from '../entities/Carrier.js';

class CarrierRepository extends ICarrierRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  async findById(carrierId) {
    const result = await this.db.query('SELECT * FROM carriers WHERE id = ?', [carrierId]);
    if (result.length === 0) return null;
    const { id, name, vehicle_type, capacity, status } = result[0];
    return new Carrier(id, name, vehicle_type, capacity, status);
  }
}

export default new CarrierRepository();