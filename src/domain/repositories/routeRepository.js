import IRouteRepository from './IRouteRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';
import Route from '../entities/Route.js';

/**
 * Repository for managing route data.
 * 
 * This class implements the `IRouteRepository` interface and provides methods
 * for retrieving route data from the database.
 * 
 * @class
 * @extends IRouteRepository
 */
class RouteRepository extends IRouteRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  /**
   * Finds a route by its ID.
   * 
   * @param {string} routeId - The ID of the route to find.
   * @returns {Route|null} - The route object if found, otherwise null.
   */
  async findById(routeId) {
    const result = await this.db.query('SELECT * FROM routes WHERE id = ?', [routeId]);
    if (result.length === 0) return null;
    const { id, name, start_location, end_location, estimated_duration } = result[0];
    return new Route(id, name, start_location, end_location, estimated_duration);
  }
}

export default new RouteRepository();