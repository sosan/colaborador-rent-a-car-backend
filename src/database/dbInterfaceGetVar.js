const redis_dao = require("../database/redis_dao");
let redisIsConnected = false;

exports.ConnectVault = async (redisdb_port, redisdb_host, redisdb_password) => {

    const redisIsConnected = await redis_dao.conectDb(redisdb_port, redisdb_host, redisdb_password);
    if (redisIsConnected === false)
    {

    }


};



exports.GetBackendVariables = async () => {
    const resultado = await redis_dao.GetVariables("variables-backend");
    return resultado;
};


exports.GetFrontendVariables = async () => {
    const resultado = await redis_dao.GetVariables("variables-frontend");
    return resultado;
};

exports.GetKeysPGP = async () =>
{

    const publicKey = await redis_dao.GetKeyPGP("public_pgp");
    const privateKey = await redis_dao.GetKeyPGP("private_pgp");

    return [publicKey, privateKey];
    
};


