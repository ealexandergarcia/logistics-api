/**
 * Interface for the Route Repository.
 * 
 * This class defines the contract for the Route Repository, which must be implemented
 * by any concrete repository class.
 * 
 * @class
 */
class IRouteRepository {
  /**
   * Finds a route by its ID.
   * 
   * @param {string} id - The ID of the route to find.
   * @throws {Error} - If the method is not implemented.
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }
}

export default IRouteRepository;