const redis_dao = require("../database/redis_dao");

exports.ConnectDB = async () => {

    await redis_dao.conectDb();
};


exports.GetBackendVariables = async () => {
    const resultado = await redis_dao.GetVariables("variables-backend");
    return resultado;
};


exports.GetFrontendVariables = async () => {
    const resultado = await redis_dao.GetVariables("variables-frontend");
    return resultado;
};


