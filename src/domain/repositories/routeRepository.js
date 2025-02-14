import IRouteRepository from './IRouteRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';
import Route from '../entities/Route.js';

class RouteRepository extends IRouteRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  async findById(routeId) {
    const result = await this.db.query('SELECT * FROM routes WHERE id = ?', [routeId]);
    if (result.length === 0) return null;
    const { id, name, start_location, end_location, estimated_duration } = result[0];
    return new Route(id, name, start_location, end_location, estimated_duration);
  }
}

export default new RouteRepository();