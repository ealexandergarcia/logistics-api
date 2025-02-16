import mysql from 'mysql2/promise';
import { databaseConfig } from '../../config/database.js';

/**
 * Manages MySQL database connections and queries.
 * 
 * This class provides a connection pool for MySQL and methods to execute queries
 * and manage connections. It follows the Singleton pattern to ensure only one
 * instance of the connection pool is created.
 * 
 * @class
 */
class MySQLConnection {
  constructor() {
    // Initialize the MySQL connection pool
    this.pool = mysql.createPool({
      ...databaseConfig.mysql, // Use MySQL configuration from the database config file
      waitForConnections: true, // Wait for available connections if the pool is full
      connectionLimit: 10, // Maximum number of connections in the pool
      queueLimit: 0, // Maximum number of connection requests in the queue
    });
  }

  /**
   * Retrieves a connection from the MySQL connection pool.
   * 
   * @returns {Promise<mysql.PoolConnection>} - A MySQL connection from the pool.
   * @throws {Error} - If an error occurs while getting the connection.
   */
  async getConnection() {
    try {
      return await this.pool.getConnection();
    } catch (error) {
      console.error('❌ Error getting MySQL connection:', error);
      throw error;
    }
  }

  /**
   * Executes a SQL query using the MySQL connection pool.
   * 
   * @param {string} sql - The SQL query to execute.
   * @param {Array} params - The parameters to pass to the SQL query.
   * @returns {Promise<Array>} - The result of the query.
   * @throws {Error} - If an error occurs while executing the query.
   */
  async query(sql, params) {
    try {
      const [rows] = await this.pool.query(sql, params);
      return rows;
    } catch (error) {
      console.error('❌ MySQL Query Error:', error);
      throw error;
    }
  }

  /**
   * Closes the MySQL connection pool.
   * 
   * This method should be called when the application is shutting down
   * to gracefully close all connections in the pool.
   * 
   * @returns {Promise<void>}
   */
  async closePool() {
    try {
      await this.pool.end();
      console.log('✅ MySQL pool closed');
    } catch (error) {
      console.error('❌ Error closing MySQL pool:', error);
    }
  }
}

// Singleton instance of MySQLConnection
let instance = null;

/**
 * Returns a singleton instance of the MySQLConnection class.
 * 
 * This function ensures that only one instance of the MySQL connection pool
 * is created and reused throughout the application.
 * 
 * @returns {MySQLConnection} - The singleton instance of MySQLConnection.
 */
export const getMySQLInstance = () => {
  if (!instance) {
    instance = new MySQLConnection();
  }
  return instance;
};