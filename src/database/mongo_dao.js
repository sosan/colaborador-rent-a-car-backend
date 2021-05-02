const { MongoClient } = require("mongodb");
const { EnumTiposErrores } = require("../errors/exceptions");

const client = new MongoClient(process.env.MONGO_DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        

    });

let collectionCars = undefined;
let collectionPrecios = undefined;
let collectionHelper = undefined;

let collectionUsers = undefined;
let collectionTokens = undefined;
let tokenFromFrontend = "";

let collectionsupleGenerico = undefined;
let collectionsupleTipochoferVehiculo = undefined;
let collectionReservas = undefined;

exports.conectDb = async () => {
    try {
        const connect = await client.connect();

        if (connect.isConnected() === true)
        {
            console.log(`[process ${process.pid}] CONNECTED TO DB`);
            const currentDb = client.db(process.env.MONGO_DB_NAME);
    
            collectionCars = currentDb.collection(process.env.MONGO_COLECCION_CARS);
            collectionPrecios = currentDb.collection(process.env.MONGO_COLECCION_PRECIOS);
            collectionHelper = currentDb.collection(process.env.MONGO_COLECCION_HELPER);
            collectionUsers = currentDb.collection(process.env.MONGO_COLECCION_USUARIOS);
            collectionTokens = currentDb.collection(process.env.MONGO_COLECCION_TOKENS);
            
            collectionsupleGenerico = currentDb.collection(process.env.MONGO_COLECCION_SUPLE_GENERICO);
            collectionsupleTipochoferVehiculo = currentDb.collection(process.env.MONGO_COLECCION_SUPLE_TIPO_CHOFER);
            collectionReservas = currentDb.collection(process.env.MONGO_COLECCION_RESERVAS);

            
            
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
        const error = `colleccion tokens no existe`;
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
            const error = `${EnumTiposErrores.SinDatos} Coleccion Precios`;
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

        if (resultados !== undefined) {
            return { isOk: true, resultados: resultados[0], errores: "" }
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


