const mongo_dao = require("./mongo_dao");

exports.CheckAdminUserPassword = async (email, password) =>
{

    const resultado = await mongo_dao.CheckAdminUserPassword(email, password);

    if (resultado.isOk === false) {
        const error = `NO hay collecion usuarios `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    return resultado;


};