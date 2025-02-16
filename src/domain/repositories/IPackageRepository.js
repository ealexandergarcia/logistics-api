/**
 * Interface for the Package Repository.
 * 
 * This class defines the contract for the Package Repository, which must be implemented
 * by any concrete repository class.
 * 
 * @class
 */
export default class IPackageRepository {
  /**
   * Saves a new package to the database.
   * 
   * @param {Package} pkg - The package object to save.
   * @throws {Error} - If the method is not implemented.
   */
  async save(pkg) {
    throw new Error('Method not implemented');
  }
}