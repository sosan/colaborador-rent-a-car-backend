const { MongoClient } = require("mongodb");
const { ObjectId } = require('mongodb');
const { EnumTiposErrores } = require("../errors/exceptions");

const client = new MongoClient(process.env.MONGO_DB_URI,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true, 

    });

let collectionCars = undefined;
let collectionPrecios = undefined;
let collectionHelper = undefined;

let collectionUsers = undefined;
let collectionAdminUsers = undefined;
let collectionTokens = undefined;
let tokenFromFrontend = "";

let collectionsupleGenerico = undefined;
let collectionsupleTipochoferVehiculo = undefined;
let collectionReservas = undefined;
let collectionLocations = undefined;

let collectionPosiblesCompradores = undefined;

let collectionPorcentajeClaseVehiculos = undefined;
let collectionEmailNewsletter = undefined;

exports.conectDb = async () => {
    try {
        const connect = await client.connect();

        if (connect.isConnected() === true)
        {
            console.log(`[process ${process.pid}] CONNECTED TO MONGO DB`);
            const currentDb = client.db(process.env.MONGO_DB_NAME);
    
            collectionCars = currentDb.collection(process.env.MONGO_COLECCION_CARS);
            collectionPrecios = currentDb.collection(process.env.MONGO_COLECCION_PRECIOS);
            collectionHelper = currentDb.collection(process.env.MONGO_COLECCION_HELPER);
            collectionUsers = currentDb.collection(process.env.MONGO_COLECCION_USUARIOS);
            collectionAdminUsers = currentDb.collection(process.env.MONGO_COLECCION_ADMIN_USUARIOS);
            collectionTokens = currentDb.collection(process.env.MONGO_COLECCION_TOKENS);
            
            collectionsupleGenerico = currentDb.collection(process.env.MONGO_COLECCION_SUPLE_GENERICO);
            collectionsupleTipochoferVehiculo = currentDb.collection(process.env.MONGO_COLECCION_SUPLE_TIPO_CHOFER);
            collectionReservas = currentDb.collection(process.env.MONGO_COLECCION_RESERVAS);

            collectionPosiblesCompradores = currentDb.collection(process.env.MONGO_COLECCION_POSIBLES_COMPRADORES);
            collectionLocations = currentDb.collection(process.env.MONGO_COLECCION_LOCATIONS);
            collectionPorcentajeClaseVehiculos = currentDb.collection(process.env.MONGO_COLECCION_PORCENTAJE_CLASE_VEHICULOS);
            collectionEmailNewsletter = currentDb.collection(process.env.MONGO_COLECCION_EMAILS_NEWSLETTER);


        }

    }
    catch (err) {
        console.error(err);
        // throw new CustomExceptions("no posible conexion a la base de datos");
        //TODO: enviar a la db Redis para recoger los errores.
    }

};

exports.GetTokenFrontendToBackend = async () =>
{

    if (collectionTokens !== undefined) {
        const datos = await collectionTokens.find({ "id": "frontend" }).project({ _id: 0 }).toArray();
        if (datos[0].isValid === false)
        {
            const error = `token frontendtobackend no valido`;
            console.error(error);
            throw new Error(error);
        }

        if (datos[0].token === "" || datos[0].token === undefined) {
            const error = `no existe el campo token`;
            console.error(error);
            throw new Error(error);
        }
        return datos[0].token;

    }
    else {
        const error = `colleccion tokens no existe o conexion no existe`;
        console.error(error);
        throw new Error(error);
    }

};

/**
 * Devuelve listado de resultados por fecha
 * @param {Array} fecha
 * @returns {null|Array} nulo o listado de resultados
 */

exports.GetCarsByReservado = async (filtro) =>
{

    try {

        const resultados = await collectionCars.find(filtro)
        .project({ _id: 0 })
        .toArray();
        
        if (resultados !== undefined)
        {
            return {isOk: true, resultados: resultados, errores: ""}
        }
        else
        {
            const error = `${EnumTiposErrores.SinDatos} Coleccion Cars`;
            console.error(error);
            return { isOk: false, resultados: undefined, errores: error };
        }

    }
    catch (err) {
        //TODO: enviar a otra db error, redis
        const error = `${err} Coleccion Cars`;
        console.error(error);

    }


};

exports.GetClaseVehiculosOrdenados = async () =>
{

    try {

        const resultados = await collectionHelper.find({ id: "ordenacion"})
            .project({ _id: 0 })
            .toArray();

        if (resultados !== undefined) {
            return { isOk: true, resultados: resultados[0].clases, errores: "" }
        }
        else {
            const error = `${EnumTiposErrores.SinDatos} Coleccion Cars`;
            console.error(error);
            return { isOk: false, resultados: undefined, errores: error };
        }

    }
    catch (err) {
        //TODO: enviar a otra db error, redis
        const error = `${err} Coleccion Cars`;
        console.error(error);

    }


};

exports.GetSuplementosTipoChoferByIndex = async (indicesSuplementos) => {

    try {

        const resultados = await collectionsupleTipochoferVehiculo.find(
            { "Tipo de Conductor(Experiencia)": { $in: indicesSuplementos } }
        )
        .project({ _id: 0 })
        .toArray();

        if (resultados !== undefined) {
            return { isOk: true, resultados: resultados, errores: "" }
        }
        else {
            const error = `${EnumTiposErrores.SinDatos} Coleccion SuplmentoTipoChofer`;
            console.error(error);
            return { isOk: false, resultados: undefined, errores: error };
        }

    }
    catch (err) {
        //TODO: enviar a otra db error, redis
        const error = `${err} Coleccion Cars`;
        console.error(error);

    }


};


exports.GetAllSuplementosTipoChofer = async () => {

    try {

        const resultados = await collectionsupleTipochoferVehiculo.find({"id": "experienciaConductor"})
        .project({ _id: 0, id: 0 })
        .toArray();

        if (resultados !== undefined) {
            return { isOk: true, resultados: resultados[0], errores: "" }
        }
        else {
            const error = `${EnumTiposErrores.SinDatos} Coleccion SuplmentoTipoChofer`;
            console.error(error);
            return { isOk: false, resultados: undefined, errores: error };
        }

    }
    catch (err) {
        //TODO: enviar a otra db error, redis
        const error = `${err} Coleccion Cars`;
        console.error(error);

    }


};


exports.GetSuplementoGenerico = async () => {

    try {

        const resultados = await collectionsupleGenerico.find(
            { "id": "suplementos" }
        )
        .project({ _id: 0, id: 0 })
        .toArray();

        if (resultados !== undefined) {
            return { isOk: true, resultados: resultados[0], errores: "" }
        }
        else {
            const error = `${EnumTiposErrores.SinDatos} Coleccion SuplmentoGenerico`;
            console.error(error);
            return { isOk: false, resultados: undefined, errores: error };
        }

    }
    catch (err) {
        //TODO: enviar a otra db error, redis
        const error = `${err} Coleccion Cars`;
        console.error(error);

    }


};


exports.GetTiposClases = async () =>
{
    try
    {
        const tiposClases = await collectionHelper.find(
            {
                "id": "clases"
            }
        )
        .project({ _id: 0 })
        .toArray();
        
        if (tiposClases !== undefined)
        {
            return { isOk: true, resultados: tiposClases[0].clases, errores: "" };
        }
        else
        {
            const error = `${EnumTiposErrores.SinDatos} Coleccion Tipos Clases`;
            console.error(error);
            return { isOk: false, resultados: undefined, errores: error };
        }

    }
    catch(error)
    {
        console.error(error);
    }
};
//TODO: ahora recoge en collectionPRecios, pero hay un array optimizado para los precios modificar
exports.GetPreciosPorClase = async (tiposClases) =>
{
    try {
        
        const resultados = await collectionPrecios.find(
            {
                "CLASE": { $in: tiposClases }
            }
        ).project({_id: 0}).toArray();

        if (resultados !== undefined) {
            return { isOk: true, resultados: resultados, errores: "" };
        }
        else {
            const error = `${EnumTiposErrores.SinDatos} Coleccion Precios`;
            console.error(error);
            return { isOk: false, resultados: undefined, errores: error };
        }

    }
    catch(error)
    {
        console.error(error);
    }

};


exports.CheckUserPassword = async (email, password) => {
    try {

        const resultados = await collectionUsers.find(
            {
                "email": email, "password": password
            }
        ).project({ _id: 0 }).toArray();

        if (resultados !== undefined) {
            return { isOk: true, resultados: resultados, errores: "" };
        }
        else {
            const error = `${EnumTiposErrores.SinDatos} Coleccion Usuarios`;
            console.error(error);
            return { isOk: false, resultados: undefined, errores: error };
        }

    }
    catch (error) {
        console.error(error);
    }

};

exports.CheckAdminUserPassword = async (email, password) => {
    try {

        const resultados = await collectionAdminUsers.find(
            {
                "email": email, "password": password
            }
        ).project({ _id: 0 }).toArray();

        if (resultados !== undefined) {
            return { isOk: true, resultados: resultados, errores: "" };
        }
        else {
            const error = `${EnumTiposErrores.SinDatos} Coleccion admin_user`;
            console.error(error);
            return { isOk: false, resultados: undefined, errores: error };
        }

    }
    catch (error) {
        console.error(error);
    }

};

exports.GetCondicionesGenerales = async () => {

    try {

        const resultados = await collectionHelper.find({ id: "condicionesgenerales" })
            .project({ _id: 0 })
            .toArray();

        let data = {};
        if (resultados !== undefined) {
            data = { isOk: true, resultados: resultados[0], errores: "" };
            // return { isOk: true, resultados: resultados[0], errores: "" };
        }
        else
        {
            const error = `${EnumTiposErrores.SinDatos} Coleccion Cars`;
            console.error(error);
            data = { isOk: false, resultados: undefined, errores: error };
            // return { isOk: false, resultados: undefined, errores: error };
        }

        return data;
    }
    catch (err) {
        //TODO: enviar a otra db error, redis
        const error = `${err} Coleccion Cars`;
        console.error(error);
    }
    
};

// exports.GetPagoRecogida = async () =>
// {
//     try
//     {
//         const resultados = await collectionHelper.find({ id: "pago_recogida" })
//             .project({ _id: 0 })
//             .toArray();

//         let data = {};
//         if (resultados !== undefined) {
//             data = { isOk: true, resultados: resultados[0], errores: "" };
//             // return { isOk: true, resultados: resultados[0], errores: "" };
//         }
//         else {
//             const error = `${EnumTiposErrores.SinDatos} Coleccion Helper`;
//             console.error(error);
//             data = { isOk: false, resultados: undefined, errores: error };
//             // return { isOk: false, resultados: undefined, errores: error };
//         }

//         return data;
//     }
//         catch (err) {
//         //TODO: enviar a otra db error, redis
//         const error = `${err} Coleccion Cars`;
//         console.error(error);
//     }

// };

exports.InsertarPosibleComprador = async (visitante) => {

    try {
        
        const result = await collectionPosiblesCompradores.insertOne(visitante);
        const isInserted = await GenerarDataInserted(result.insertedCount, visitante);
        return isInserted;
        
    } catch (err) {
        //TODO: enviar a otra db error, redis
        const error = `${err} Coleccion posibles_compradores`;
        console.error(error);
    }
    
    
};

const GenerarDataInserted = async (insertedCount, visitante) =>
{

    if (insertedCount > 1) {
        throw new Error(`insercion duplicada en insertarposiblecomprador: ${visitante}`);
    }

    let isInserted = true ;

    if (insertedCount === 0)
    {
        console.log(`insercion no posible en insertarposiblecomprador: ${visitante}`);
        isInserted = false;
    }
    
    return isInserted;

};


exports.ActualizarPosibleComprador = async (idVisitante, faseActual, visitanteActualizado) =>
{

    try {
        
        // { $push: { "violations": { "hola": "hola" } } 
        const result = await collectionPosiblesCompradores.findOneAndUpdate(
            { "compradorId": idVisitante }, //comprador.compradorId },
            { 
                $set: { "faseActual": faseActual } , 
                $push: { "rutaDatos": {  ...visitanteActualizado } }
                
            }
        );
        
        const isUpdated = await GenerarDataUpdated(result.ok, visitanteActualizado);
        return isUpdated;


    } catch (err) {
        //TODO: enviar a otra db error, redis
        const error = `${err} Coleccion posibles_compradores`;
        console.error(error);
    }

};





const GenerarDataUpdated = async (updatedCount, visitante) => {

    if (updatedCount > 1) {
        throw new Error(`insercion duplicada en insertarposiblecomprador: ${visitante}`);
    }

    let isUpdated = true;

    if (updatedCount === 0) {
        console.log(`insercion no posible en insertarposiblecomprador: ${visitante}`);
        isUpdated = false;
    }

    return isUpdated;

};


exports.GetLocation = async () =>
{

    try {
        const datos = await collectionLocations.find({ "id": "locations" }).project({ _id: 0, id: 0 }).toArray();
        return datos[0];

    } catch (error) {
        console.log("error" + error);

    }

};


exports.GetPorcentajeTipoVehiculo = async () => 
{
    try {
        const datos = await collectionPorcentajeClaseVehiculos.find({ "id": "porcentaje_clase_vehiculos" }).project({ _id: 0, id: 0 }).toArray();
        return datos[0];

    } catch (error) {
        console.log("error" + error);

    }


};


exports.ProcesarReserva = async (formulario) =>
{
    try {

        const result = await collectionReservas.insertOne(formulario);
        let objectId = ObjectId(result.insertedId.id);
        const isInserted = result.insertedCount === 1;
        
        return {"isInserted": isInserted, "objectId": objectId };

    }
    catch (err)
    {
        //TODO: enviar a otra db error, redis
        const error = `${err} Coleccion Reservas`;
        console.error(error);
    }
    
};

exports.CheckEmailNewsletter = async (email) =>
{

    try {
        const datos = await collectionEmailNewsletter.countDocuments({ "email": email });
        return datos;

    } catch (error) {
        console.log("error" + error);

    }


};

exports.AddEmailNewsletter = async (email) => {

    try {
        const result = await collectionEmailNewsletter.insertOne({ "email": email });
        let isInserted = false;
        if (result.insertedCount === 1)
        {
            isInserted = true;
        }
        
        // const isInserted = result.insertedCount === 1;
        return isInserted;

    } catch (error) {
        console.log("error" + error);

    }


};


exports.UpdateReserva = async (emailsEnviados, objectId) =>
{

    try
    {

        const resultados = await collectionReservas.findOneAndUpdate(
            { _id: objectId },
            {
                $set: emailsEnviados
            });
        
        const isUpdated = resultados.ok === 1;
        return isUpdated;


    }
    catch (err) {
        //TODO: enviar a otra db error, redis
        const error = `${err} Coleccion Cars`;
        console.error(error);

    }

};


exports.GetImagenBase64 = async () =>
{

    try {
        const datos = await collectionHelper.find({ "id": "imagen" }).project({ _id: 0, id: 0 }).toArray();
        return datos[0].imagen;

    } catch (error) {
        console.log("error" + error);

    }
}


exports.GetAllReservas = async () =>
{
    try
    {
        const datos = await collectionReservas.find({}).project({_id: 0}).toArray();
        return datos;

    }
    catch (error)
    {
        console.log("error" + error);
    }

}