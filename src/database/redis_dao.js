const Redis = require("ioredis");

let redisClient = undefined;


exports.conectDb = async (redisdb_port, redisdb_host, redisdb_password) =>
{
    if (redisClient !== undefined) return;
    
    try 
    {
        // console.log("redisdb_port=" + redisdb_port);
        // console.log("redisdb_host=" + redisdb_host);
        // console.log("redisdb_password=" + redisdb_password);

        redisClient = new Redis({
            port: redisdb_port || process.env.REDISDB_PORT,
            host: redisdb_host || process.env.REDISDB_HOST,
            family: 4,
            password: redisdb_password || process.env.REDISDB_PASSWORD,
            db: 0
        });


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



exports.GetVariables = async (key) => {

    try {

        const vars = await redisClient.get(key);
        return vars;
        
    }
    catch (error) {
        console.error(error);
    }
}
