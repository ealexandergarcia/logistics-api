import { createClient } from 'redis';

/**
 * Redis client configuration and initialization.
 * 
 * This file sets up a Redis client using the `redis` library and connects to the Redis server.
 * It also handles connection errors and ensures the client is connected before exporting it.
 * 
 * @module redisClient
 */

// Create a Redis client with the specified configuration
const client = createClient({
  username: 'default', // Redis username
  password: '6QubIjjMqPdCzdFwiNK3C9XVStSdqRHg', // Redis password
  socket: {
    host: 'redis-17448.c326.us-east-1-3.ec2.redns.redis-cloud.com', // Redis server host
    port: 17448, // Redis server port
  },
});

// Handle Redis connection errors
client.on('error', (err) => console.log('Redis Client Error', err));

/**
 * Connects to the Redis server.
 * 
 * This function establishes a connection to the Redis server and logs any errors
 * that occur during the connection process.
 * 
 * @async
 * @function connectRedis
 * @returns {Promise<void>}
 */
const connectRedis = async () => {
  await client.connect();
};

// Establish the Redis connection
connectRedis();

// Export the Redis client for use in other parts of the application
export default client;