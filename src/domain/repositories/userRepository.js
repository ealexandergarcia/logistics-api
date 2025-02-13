import IUserRepository from './IUserRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';

class UserRepository extends IUserRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  async findByEmail(email) {
    const user = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    return user[0];
  }

  async save(user) {
    const result = await this.db.query('INSERT INTO users (email, password) VALUES (?, ?)', [user.email, user.password]);
    return result.insertId;
  }
}

export default new UserRepository();