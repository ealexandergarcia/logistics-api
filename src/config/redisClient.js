import { createClient } from 'redis';

/**
 * Redis client configuration and initialization.
 * 
 * This file sets up a Redis client using the `redis` library and connects to the Redis server.
 * It also handles connection errors.
 * 
 * @module redisClient
 */
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

// Connect to the Redis server
await client.connect();

export default client;