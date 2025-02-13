import mysql from 'mysql2/promise';
import { databaseConfig } from '../../config/database.js';

class MySQLConnection {
  constructor() {
    this.pool = mysql.createPool({
      ...databaseConfig.mysql,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async getConnection() {
    try {
      return await this.pool.getConnection();
    } catch (error) {
      console.error('❌ Error getting MySQL connection:', error);
      throw error;
    }
  }

  async query(sql, params) {
    try {
      const [rows] = await this.pool.query(sql, params);
      return rows;
    } catch (error) {
      console.error('❌ MySQL Query Error:', error);
      throw error;
    }
  }

  async closePool() {
    try {
      await this.pool.end();
      console.log('✅ MySQL pool closed');
    } catch (error) {
      console.error('❌ Error closing MySQL pool:', error);
    }
  }
}

let instance = null;

export const getMySQLInstance = () => {
  if (!instance) {
    instance = new MySQLConnection();
  }
  return instance;
};
