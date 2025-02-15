import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: '6QubIjjMqPdCzdFwiNK3C9XVStSdqRHg',
    socket: {
        host: 'redis-17448.c326.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 17448
    }
});

client.on('error', err => console.log('Redis Client Error', err));

const connectRedis = async () => {
    await client.connect();
};

connectRedis();

export default client;