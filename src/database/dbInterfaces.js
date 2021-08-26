const mongo_dao = require('../database/mongo_dao');
const redis_dao = require("../database/redis_dao");

const { ObjectId } = require('mongodb');

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

exports.GetLocation = async () =>
{
    const datos = await mongo_dao.GetLocation();
    return datos;

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



exports.GetMasValorados = async () => 
{
    const result = await redis_dao.GetMasValorados();
    return result;


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

exports.ActualizarPosibleComprador = async (idVisitante, faseActual, visitanteActualizado) =>
{

    const resultado = await mongo_dao.ActualizarPosibleComprador(idVisitante, faseActual, visitanteActualizado);
    return resultado;


};


exports.GetPorcentajeTipoVehiculo = async () =>
{
    const resultado = await mongo_dao.GetPorcentajeTipoVehiculo();
    return resultado;
};


exports.ProcesarReserva = async (formulario) => {

    const resultado = await mongo_dao.ProcesarReserva(formulario);
    return resultado;

};

exports.UpdateReservasByLocalizador = async (localizador, merchantParameters) =>
{

    const [isUpdated, reserva ]= await mongo_dao.UpdateReservasByLocalizador(localizador, merchantParameters);
    return [isUpdated, reserva];

};


exports.ConsultarCantidadReservasDia = async(cadenaComprobarDia) =>
{

    const resultado = await redis_dao.ConsultarCantidadReservasDia(cadenaComprobarDia);
    return resultado;

};

exports.CheckEmailNewsletter = async (email) =>
{

    const resultado = await mongo_dao.CheckEmailNewsletter(email);
    return resultado;

};

exports.AddEmailNewsletter = async (email) => 
{
    const resultado = await mongo_dao.AddEmailNewsletter(email);
    return resultado;


};


exports.UpdateReserva = async (emailsEnviados, objectId, currentDate) =>
{
    const resultado = await mongo_dao.UpdateReserva(emailsEnviados, objectId);
    return resultado;

};

exports.UpdateReservaWithString = async (emailsEnviados, objectId, currentDate) =>
{

    const resultado = await mongo_dao.UpdateReserva(emailsEnviados, ObjectId(objectId));
    return resultado;

    

};


exports.GetImagenBase64 = async () =>
{
    const resultado = await mongo_dao.GetImagenBase64();
    return resultado;
};


exports.ConsultarLocalizador = async (localizador) =>
{

    const resultado = await mongo_dao.ConsultarLocalizador(localizador);
    return resultado;

};

exports.GetReservasNotSended = async () =>
{
    const resultado = await mongo_dao.GetReservasNotSended();
    return resultado;


};

exports.GetReservasSended = async () => {
    const resultado = await mongo_dao.GetReservasSended();
    return resultado;


};


exports.GetReservasConfirmacionEnviada = async (fechaInicio, fechaFin, enviado) => {

    const resultado = await mongo_dao.GetReservasConfirmacionEnviada(fechaInicio, fechaFin, enviado);
    return resultado;
};

exports.GetReservasConfirmacionNoEnviada = async (fechaInicio, fechaFin, enviado) => {

    const resultado = await mongo_dao.GetReservasConfirmacionNoEnviada(fechaInicio, fechaFin, enviado);
    return resultado;
};

exports.MarcarCorreoNewsletterCorrectoIncorrecto = async (correo, validez) =>
{
    const resultado = await mongo_dao.MarcarCorreoNewsletterCorrectoIncorrecto(correo, validez);
    return resultado;

}