import IUserRepository from './IUserRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';

/**
 * Repository for managing user data.
 * 
 * This class implements the `IUserRepository` interface and provides methods
 * for saving and retrieving user data from the database.
 * 
 * @class
 * @extends IUserRepository
 */
class UserRepository extends IUserRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  /**
   * Finds a user by their email.
   * 
   * @param {string} email - The email of the user to find.
   * @returns {Object|null} - The user data if found, otherwise null.
   */
  async findByEmail(email) {
    const user = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    return user[0];
  }

  /**
   * Saves a new user to the database.
   * 
   * @param {User} user - The user object to save.
   * @returns {number} - The ID of the newly created user.
   */
  async save(user) {
    const result = await this.db.query('INSERT INTO users (email, password) VALUES (?, ?)', [user.email, user.password]);
    return result.insertId;
  }

  /**
   * Finds a user by their ID.
   * 
   * @param {string} userId - The ID of the user to find.
   * @returns {Object|null} - The user data if found, otherwise null.
   */
  async findById(userId) {
    const user = await this.db.query('SELECT * FROM users WHERE id = ?', [userId]);
    return user[0];
  }
}

export default new UserRepository();