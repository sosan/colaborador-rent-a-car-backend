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

exports.GetMasValorados = async () =>
{

    // const result = await redisClient.zrange("visitas_vehiculos", );
    //zrevrange deprecated 6.2+
    const result = await redisClient.zrevrange("visitas_vehiculos", 0, 0);
    return result;
    


};


exports.ConsultarCantidadReservasDia = async (cadenaComprobarDia) =>
{

    const result = await redisClient.incr(cadenaComprobarDia);
    return result;


};


exports.GetBackendVariables = async () => {


}

exports.GetVariables = async (key) => {

    try {

        const vars = await redisClient.get(key);
        return vars;
        
    }
    catch (error) {
        console.error(error);
    }
}
