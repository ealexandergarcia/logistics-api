/**
 * Interface for the Address Repository.
 * 
 * This class defines the contract for the Address Repository, which must be implemented
 * by any concrete repository class.
 * 
 * @class
 */
export default class IAddressRepository {
  /**
   * Saves a new address to the database.
   * 
   * @param {Address} address - The address object to save.
   * @throws {Error} - If the method is not implemented.
   */
  async save(address) {
    throw new Error('Method not implemented');
  }
}