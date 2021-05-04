const Redis = require("ioredis");

const redisClient = new Redis({
    port: process.env.REDISDB_PORT,
    host: process.env.REDISDB_HOST,
    password: process.env.REDISDB_PASSWORD,
    db: 0
});


exports.conectDb = async () => 
{
    try 
    {
    
        if (await redisClient.ping() === "PONG")
        {
            console.log(`[process ${process.pid}] CONNECTED TO REDIS DB`);
        }
        else
        {
            console.log("CONEXION NO POSIBLE A REDIS");
        }
        
    
    } 
    catch (error) {
        console.error(error);
    }

};


exports.SumarVisitaVehiculo = async (vehiculo) =>
{
    const resultado = await redisClient.zincrby("visitas_vehiculos", 1, vehiculo);
    return resultado;

};