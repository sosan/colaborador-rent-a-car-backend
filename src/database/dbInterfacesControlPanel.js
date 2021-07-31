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


exports.GetTranslations = async () =>
{

    const resultado = await mongo_dao.GetLocation();
    return resultado;

};

exports.BorrarTraduccionAnterior = async (nombreId) =>
{
    const resultado = await mongo_dao.BorrarTraduccion(nombreId);
    return resultado;

};

exports.ActualizarTraduccion = async (hojaCalculo, nombreId) =>
{

    const resultado = await mongo_dao.ActualizarTraduccion(hojaCalculo, nombreId);
    return resultado;
};

exports.InsertarTraduccion = async (hojaCalculo, nombreId) =>
{
    hojaCalculo["id"] = nombreId;
    const resultado = await mongo_dao.InsertarTraduccion(hojaCalculo);
    return resultado;
};

exports.GetStats = async (fechaInicio, fechaFin) =>
{

    const numeroEmailsPorEnviar = await mongo_dao.NumeroEmailsConfirmacionPorEnviar();
    
    const hoyNumeroReservas = await mongo_dao.NumeroReservasPorDia(fechaInicio, fechaFin);


    let datos = {
        "numeroEmailsPorEnviar": numeroEmailsPorEnviar,
        "hoyNumeroReservas": hoyNumeroReservas
    };

    return datos;

};