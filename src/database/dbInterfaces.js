const mongo_dao = require('../database/mongo_dao');
const { EnumTiposErrores } = require("../errors/exceptions");

const DAY_IN_MILISECONDS = 86400000;
const DIA_DATE = new Date(DAY_IN_MILISECONDS);

const EDAD_MINIMA_FORMULARIO = 27;
const EDAD_MAXIMA_FORMULARIO = 68;

let tokenFromFrontend = "incial";

exports.ConnectDB = async () =>
{
    await mongo_dao.conectDb();
    this.tokenFromFrontend = await mongo_dao.GetTokenFrontendToBackend();
    
    if (this.tokenFromFrontend === undefined || this.tokenFromFrontend === "")
    {
        throw new Error("token no seteado")
    }
    
    console.log("Token seteado");
    
};

exports.GetTokenFromFrontend = () =>
{
    return tokenFromFrontend;
};


/**
 * Devuelve listado de resultados por fecha
 * @param {Array} fecha
 * @returns {null|Array} nulo o listado de resultados
 */

exports.GetCarsByReservado = async (reservado, conductor_con_experiencia) => {

    const filtrado = await GenerarParametros(reservado, conductor_con_experiencia);
    const datos = await mongo_dao.GetCarsByReservado(filtrado);

    const datosOrdenacion = await mongo_dao.GetClaseVehiculosOrdenados();
    if (datosOrdenacion.isOk === false)
    {
        const error = `NO hay collecion datos ordenados `;
        console.error(error);
        return { isOk: false, resultados: undefined, errores: error };
    }

    datos["datosOrdenacion"] = datosOrdenacion;

    
    return datos;

};

// funcion donde genera el objeto para filtrar en la db
const GenerarParametros = async (reservado, conductor_con_experiencia) => {

    if (conductor_con_experiencia === "on") {
        return { "reservado": reservado };
    }
    else {
        return {
            "reservado": reservado,
            "edadChofer": { $nin: [EDAD_MINIMA_FORMULARIO, EDAD_MAXIMA_FORMULARIO] }
        };
    }

}

exports.GetTiposClases = async () => {

    const resultados = await mongo_dao.GetTiposClases();
    return resultados;

};

exports.GetPreciosPorClase = async (tiposClases) => {

    const resultados = await mongo_dao.GetPreciosPorClase(tiposClases);
    return resultados;

};


