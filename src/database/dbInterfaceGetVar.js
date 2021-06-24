const redis_dao = require("../database/redis_dao");

exports.ConnectVault = async (redisdb_port, redisdb_host, redisdb_password) => {

    await redis_dao.conectDb(redisdb_port, redisdb_host, redisdb_password);
};



exports.GetBackendVariables = async () => {
    const resultado = await redis_dao.GetVariables("variables-backend");
    return resultado;
};


exports.GetFrontendVariables = async () => {
    const resultado = await redis_dao.GetVariables("variables-frontend");
    return resultado;
};


