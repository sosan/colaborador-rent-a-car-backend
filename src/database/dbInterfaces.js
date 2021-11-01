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
    return await mongo_dao.GetLocation();

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

    return await mongo_dao.GetCarsByReservado(filtrado);
    

};

exports.GetCarByDescripcion = async (descripcion) =>
{
    return await mongo_dao.GetCarByDescripcion(descripcion);

};

exports.GetClaseVehiculosOrdenados = async () =>
{

    return await mongo_dao.GetClaseVehiculosOrdenados();

};

exports.GetSuplementosTipoChofer = async () =>
{

    return await mongo_dao.GetAllSuplementosTipoChofer();

};



exports.GetSuplementoGenerico = async () => {

    return await mongo_dao.GetSuplementoGenerico();

};


exports.GetTiposClases = async () => {

    return await mongo_dao.GetTiposClases();

};

exports.GetPreciosPorClase = async (tiposClases) => {

    return await mongo_dao.GetPreciosPorClase(tiposClases);

};

exports.GetPreciosUnicaClase = async (tipoClase) =>
{

    return await mongo_dao.GetPreciosUnicaClase(tipoClase);

};

exports.GetCondicionesGenerales = async () =>
{

    return await mongo_dao.GetCondicionesGenerales();
    
};



exports.GetMasValorados = async () => 
{
    return await redis_dao.GetMasValorados();
    


};

exports.SumarVisitaVehiculo = async (vehiculo) =>
{
    return await redis_dao.SumarVisitaVehiculo(vehiculo);
    

};




exports.InsertarPosibleComprador = async (comprador) => {

    return await mongo_dao.InsertarPosibleComprador(comprador);
    

};

exports.ActualizarPosibleComprador = async (idVisitante, faseActual, visitanteActualizado) =>
{

    return await mongo_dao.ActualizarPosibleComprador(idVisitante, faseActual, visitanteActualizado);
    


};


exports.GetPorcentajeTipoVehiculo = async () =>
{
    return await mongo_dao.GetPorcentajeTipoVehiculo();
    
};


exports.ProcesarReserva = async (formulario) => {

    return await mongo_dao.ProcesarReserva(formulario);
    

};

exports.UpdateReservasByLocalizador = async (localizador, merchantParameters) =>
{

    const [isUpdated, reserva ]= await mongo_dao.UpdateReservasByLocalizador(localizador, merchantParameters);
    return [isUpdated, reserva];

};


exports.ConsultarCantidadReservasDia = async(cadenaComprobarDia) =>
{

    return await redis_dao.ConsultarCantidadReservasDia(cadenaComprobarDia);
    

};

exports.CheckEmailNewsletter = async (email) =>
{

    return await mongo_dao.CheckEmailNewsletter(email);
    

};

exports.AddEmailNewsletter = async (email) => 
{
    return await mongo_dao.AddEmailNewsletter(email);
    


};


exports.UpdateReserva = async (emailsEnviados, objectId, currentDate) =>
{
    return await mongo_dao.UpdateReserva(emailsEnviados, objectId);
    

};

exports.UpdateReservaWithString = async (emailsEnviados, objectId, currentDate) =>
{

    return await mongo_dao.UpdateReserva(emailsEnviados, ObjectId(objectId));
    

    

};


exports.GetImagenBase64 = async () =>
{
    return await mongo_dao.GetImagenBase64();
    
};


exports.ConsultarLocalizador = async (localizador) =>
{

    return await mongo_dao.ConsultarLocalizador(localizador);
    

};

exports.GetReservasNotSended = async () =>
{
    return await mongo_dao.GetReservasNotSended();
    


};

exports.GetReservasSended = async () => {
    return await mongo_dao.GetReservasSended();


};


exports.GetReservasConfirmacionEnviada = async (fechaInicio, fechaFin, enviado) => {

    return await mongo_dao.GetReservasConfirmacionEnviada(fechaInicio, fechaFin, enviado);
};

exports.GetReservasConfirmacionNoEnviada = async (fechaInicio, fechaFin, enviado) => {

    return await mongo_dao.GetReservasConfirmacionNoEnviada(fechaInicio, fechaFin, enviado);
};

exports.MarcarCorreoNewsletterCorrectoIncorrecto = async (correo, validez) =>
{
    return await mongo_dao.MarcarCorreoNewsletterCorrectoIncorrecto(correo, validez);

}