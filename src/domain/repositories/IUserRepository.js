/**
 * Interface for the User Repository.
 * 
 * This class defines the contract for the User Repository, which must be implemented
 * by any concrete repository class.
 * 
 * @class
 */
export default class IUserRepository {
  /**
   * Finds a user by their email.
   * 
   * @param {string} email - The email of the user to find.
   * @throws {Error} - If the method is not implemented.
   */
  async findByEmail(email) {
    throw new Error('Method not implemented');
  }

  /**
   * Saves a new user to the database.
   * 
   * @param {User} user - The user object to save.
   * @throws {Error} - If the method is not implemented.
   */
  async save(user) {
    throw new Error('Method not implemented');
  }
}