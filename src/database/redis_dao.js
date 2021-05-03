const Redis = require("ioredis");
let redisClient = undefined;

exports.conectDb = async () => 
{
    
    try 
    {
        redisClient = new Redis({
            port: process.env.REDISDB_PORT,
            host: process.env.REDISDB_HOST,
            password: process.env.REDISDB_PASSWORD,
            db: 0
        });

        if (redisClient.status !== "connecting" && redisClient.status !== "connected")
        {
            await redisClient.connect();
        }

        if (await redisClient.ping() === "PONG")
        {
            console.log(`[process ${process.pid}] CONNECTED TO REDIS DB`);
        }

    } 
    catch (error) {
        console.error(error);
    }

};