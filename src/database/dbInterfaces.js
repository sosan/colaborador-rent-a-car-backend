const mongo_dao = require('../database/mongo_dao');
const redis_dao = require("../database/redis_dao");
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

    await redis_dao.conectDb();
    
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

exports.GetCarsByReservado = async (filtrado) => {

    const datos = await mongo_dao.GetCarsByReservado(filtrado);
    return datos;

};

exports.GetClaseVehiculosOrdenados = async () =>
{

    const datos = await mongo_dao.GetClaseVehiculosOrdenados();
    return datos;

};

exports.GetSuplementosTipoChofer = async () =>
{

    const datosAll = await mongo_dao.GetAllSuplementosTipoChofer();
    return datosAll;

};



exports.GetSuplementoGenerico = async () => {

    const datos = await mongo_dao.GetSuplementoGenerico();
    return datos;

};


exports.GetTiposClases = async () => {

    const resultados = await mongo_dao.GetTiposClases();
    return resultados;

};

exports.GetPreciosPorClase = async (tiposClases) => {

    const resultados = await mongo_dao.GetPreciosPorClase(tiposClases);
    return resultados;

};

exports.GetCondicionesGenerales = async () =>
{

    const resultados = await mongo_dao.GetCondicionesGenerales();
    return resultados;
};


exports.SumarVisitaVehiculo = async (vehiculo) =>
{
    const resultado = await redis_dao.SumarVisitaVehiculo(vehiculo);
    return resultado;

};



exports.InsertarPosibleComprador = async (comprador) => {

    const resultado = await mongo_dao.InsertarPosibleComprador(comprador);
    return resultado;


};

exports.ActualizarPosibleComprador = async (comprador) =>
{

    const resultado = await mongo_dao.ActualizarPosibleComprador(comprador);
    return resultado;


};