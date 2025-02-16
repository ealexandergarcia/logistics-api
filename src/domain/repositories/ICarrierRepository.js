/**
 * Interface for the Carrier Repository.
 * 
 * This class defines the contract for the Carrier Repository, which must be implemented
 * by any concrete repository class.
 * 
 * @class
 */
class ICarrierRepository {
  /**
   * Finds a carrier by its ID.
   * 
   * @param {string} id - The ID of the carrier to find.
   * @throws {Error} - If the method is not implemented.
   */
  async findById(id) {
    throw new Error('Method not implemented');
  }
}

export default ICarrierRepository;