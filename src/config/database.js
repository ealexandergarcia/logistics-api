/**
 * Configuration for database connections.
 * 
 * This file exports configuration objects for MySQL and Redis databases.
 * It uses environment variables to set connection details.
 * 
 * @module databaseConfig
 */
export const databaseConfig = {
    mysql: {
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      port: process.env.MYSQL_PORT,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    }
  };